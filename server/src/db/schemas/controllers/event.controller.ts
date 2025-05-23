import Event, { IEvent, ITicketTier } from "../event.schema";

interface RawTicketTierData {
  id: string;
  name: string;
  description: string;
  price: string;
  supply: string;
  perks: string;
  resaleAllowed: boolean;
  royaltyPercent: number;
}

interface RawEventData {
  organizerWalletAddress: string;
  title: string;
  description: string;
  category: string;
  locationType: 'physical' | 'virtual';
  location: string;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  ticketTiers: string;
  defaultRoyaltyPercent: string;
  allowResale: string;
  useWhitelist: string;
  bannerImage?: Express.Multer.File | null;
  logoImage?: Express.Multer.File | null;
}

const validateEventData = (data: RawEventData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.organizerWalletAddress || typeof data.organizerWalletAddress !== 'string' || data.organizerWalletAddress.trim() === '') {
    errors.push('Organizer wallet address is required.');
  }
  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    errors.push('Event title is required.');
  }
  if (!data.description || typeof data.description !== 'string' || data.description.trim() === '') {
    errors.push('Event description is required.');
  }
  if (!data.category || typeof data.category !== 'string' || data.category.trim() === '') {
    errors.push('Event category is required.');
  }
  if (!['physical', 'virtual'].includes(data.locationType)) {
    errors.push('Invalid location type.');
  }
  if (!data.location || typeof data.location !== 'string' || data.location.trim() === '') {
    errors.push('Event location is required.');
  }
  if (!data.startDate || isNaN(new Date(data.startDate).getTime())) {
    errors.push('Valid start date is required.');
  }
  if (!data.startTime || typeof data.startTime !== 'string' || data.startTime.trim() === '') {
    errors.push('Start time is required.');
  }
  if (data.endDate && isNaN(new Date(data.endDate).getTime())) {
    errors.push('Invalid end date.');
  }
  if (data.startDate && data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
    errors.push('End date cannot be before start date.');
  }

  let parsedTicketTiers: RawTicketTierData[] = [];
  try {
    parsedTicketTiers = JSON.parse(data.ticketTiers);
    if (!Array.isArray(parsedTicketTiers) || parsedTicketTiers.length === 0) {
      errors.push('At least one ticket tier is required.');
    } else {
      parsedTicketTiers.forEach((tier, index) => {
        if (!tier.name || typeof tier.name !== 'string' || tier.name.trim() === '') {
          errors.push(`Ticket tier ${index + 1}: Name is required.`);
        }
        const price = parseFloat(tier.price);
        if (isNaN(price) || price < 0) {
          errors.push(`Ticket tier ${index + 1}: Valid price (SOL) is required.`);
        }
        const supply = parseInt(tier.supply, 10);
        if (isNaN(supply) || supply < 1) {
          errors.push(`Ticket tier ${index + 1}: Valid supply (at least 1) is required.`);
        }
        if (typeof tier.resaleAllowed !== 'boolean') {
          errors.push(`Ticket tier ${index + 1}: Resale allowed must be a boolean.`);
        }
        const royalty = parseFloat(tier.royaltyPercent as unknown as string);
        if (isNaN(royalty) || royalty < 0 || royalty > 15) {
          errors.push(`Ticket tier ${index + 1}: Royalty percentage must be between 0 and 15.`);
        }
      });
    }
  } catch (e) {
    errors.push('Ticket tiers data is malformed JSON.');
  }

  const defaultRoyalty = parseFloat(data.defaultRoyaltyPercent);
  if (isNaN(defaultRoyalty) || defaultRoyalty < 0 || defaultRoyalty > 15) {
    errors.push('Default royalty percentage must be between 0 and 15.');
  }
  if (!['true', 'false'].includes(data.allowResale)) {
    errors.push('Allow resale must be a boolean string.');
  }
  if (!['true', 'false'].includes(data.useWhitelist)) {
    errors.push('Use whitelist must be a boolean string.');
  }

  return { isValid: errors.length === 0, errors };
};

const createEvent = async (rawData: RawEventData) => {
  const { isValid, errors } = validateEventData(rawData);

  if (!isValid) {
    throw new Error(`Validation Error: ${errors.join('; ')}`);
  }

  try {
    const ticketTiersParsed: ITicketTier[] = JSON.parse(rawData.ticketTiers).map((tier: RawTicketTierData) => ({
      name: tier.name,
      description: tier.description,
      priceSOL: parseFloat(tier.price),
      supply: parseInt(tier.supply, 10),
      ticketsSold: 0,
      perks: tier.perks,
      resaleAllowed: tier.resaleAllowed,
      royaltyPercent: tier.royaltyPercent,
      revenueSOL: 0,
    }));

    const eventData: Partial<IEvent> = {
      organizerWalletAddress: rawData.organizerWalletAddress,
      title: rawData.title,
      description: rawData.description,
      category: rawData.category,
      locationType: rawData.locationType,
      location: rawData.location,
      startDate: new Date(rawData.startDate),
      startTime: rawData.startTime,
      endDate: rawData.endDate ? new Date(rawData.endDate) : undefined,
      endTime: rawData.endTime,
      bannerImage: rawData.bannerImage ? `` : undefined,
      logoImage: rawData.logoImage ? `` : undefined,
      ticketTiers: ticketTiersParsed,
      defaultRoyaltyPercent: parseFloat(rawData.defaultRoyaltyPercent),
      allowResale: rawData.allowResale === 'true',
      useWhitelist: rawData.useWhitelist === 'true',
      status: 'draft',
      previewMode: false, 
      totalTicketsSold: 0,
      totalCapacity: ticketTiersParsed.reduce((sum, tier) => sum + tier.supply, 0),
      totalRevenueSOL: 0,
      totalRoyaltiesEarnedSOL: 0,
      totalAttendeesCheckedIn: 0,
    };

    const newEvent = new Event(eventData);
    await newEvent.save();
    console.log('Event saved to database:', newEvent);
    return newEvent;
  } catch (error) {
    console.error('Error saving event to database:', error);
    throw error;
  }
};

export { createEvent };