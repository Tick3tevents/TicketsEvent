import mongoose, { Types } from 'mongoose';
import Event, { IEvent, ITicketTier } from "../event.schema";
import Purchase, { IPurchase } from "../purchase.schema";

export interface RawTicketTierDataForCreate {
  id: string;
  name: string;
  description: string;
  price: string;
  supply: string;
  perks: string;
  resaleAllowed: boolean;
  royaltyPercent: number;
}

export interface RawEventDataForCreate {
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
  bannerImage?: any;
  logoImage?: any;
}

export interface UpdateTicketTierInputData {
  name: string;
  description?: string;
  priceSOL?: number;
  supply?: number;
  perks?: string;
  resaleAllowed?: boolean;
  royaltyPercent?: number;
}

export interface UpdateEventInputData {
  title?: string;
  description?: string;
  category?: string;
  locationType?: 'physical' | 'virtual';
  location?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  bannerImage?: string;
  logoImage?: string;
  defaultRoyaltyPercent?: number;
  allowResale?: boolean;
  useWhitelist?: boolean;
  status?: 'draft' | 'published' | 'ended' | 'cancelled';
  previewMode?: boolean;
  ticketTiers?: UpdateTicketTierInputData[];
}

export interface PurchaseInputData {
  eventId: string;
  ticketTierId: string;
  purchaserWalletAddress: string;
  quantity: number;
  transactionSignature?: string;
}

const validateEventData = (data: RawEventDataForCreate): { isValid: boolean; errors: string[] } => {
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
  let parsedTicketTiers: RawTicketTierDataForCreate[] = [];
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

export const createEvent = async (rawData: RawEventDataForCreate): Promise<IEvent> => {
  const { isValid, errors } = validateEventData(rawData);
  if (!isValid) {
    throw new Error(`Validation Error: ${errors.join('; ')}`);
  }
  try {
    const ticketTiersParsed: ITicketTier[] = JSON.parse(rawData.ticketTiers).map((tier: RawTicketTierDataForCreate) => ({
      name: tier.name,
      description: tier.description,
      priceSOL: parseFloat(tier.price),
      supply: parseInt(tier.supply, 10),
      ticketsSold: 0,
      perks: tier.perks,
      resaleAllowed: tier.resaleAllowed,
      royaltyPercent: tier.royaltyPercent,
      revenueSOL: 0,
      purchaseIds: [],
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
      bannerImage: rawData.bannerImage ? `placeholder/banner.jpg` : undefined,
      logoImage: rawData.logoImage ? `placeholder/logo.png` : undefined,
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
    return newEvent;
  } catch (error) {
    console.error('Error saving event to database:', error);
    throw error;
  }
};

export const getEventsByOrganizerWallet = async (organizerWalletAddress: string): Promise<IEvent[]> => {
  if (!organizerWalletAddress || typeof organizerWalletAddress !== 'string' || organizerWalletAddress.trim() === '') {
    throw new Error('Organizer wallet address is required and must be a non-empty string.');
  }
  try {
    const events = await Event.find({ organizerWalletAddress }).exec();
    return events;
  } catch (error) {
    console.error(`Error fetching events for wallet ${organizerWalletAddress}:`, error);
    throw error;
  }
};

export const getEventDetails = async (eventId: string): Promise<any> => {
  if (!eventId) {
    throw new Error('Event ID is required.');
  }
  try {
    const event = await Event.findById(eventId).lean().exec();
    if (!event) {
      throw new Error('Event not found.');
    }

    const purchases = await Purchase.find({ eventId: event._id }).lean().exec();

    const attendees = purchases.map((purchase: any) => ({
      wallet: purchase.purchaserWalletAddress,
      ticketType: purchase.ticketTierName,
      checkedIn: purchase.status === 'checked-in',
      resold: purchase.status === 'resold',
    }));

    const checkInRate = event.totalTicketsSold > 0 ? (event.totalAttendeesCheckedIn / event.totalTicketsSold) * 100 : 0;

    const frontendEventData = {
      id: event._id.toString(),
      name: event.title,
      image: event.bannerImage || "/placeholder.svg",
      date: new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      time: `${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''}`,
      location: event.location,
      description: event.description,
      status: event.status,
      ticketsSold: event.totalTicketsSold,
      totalCapacity: event.totalCapacity,
      revenue: `${event.totalRevenueSOL} SOL`,
      tiers: event.ticketTiers.map(tier => ({
        name: tier.name,
        price: `${tier.priceSOL} SOL`,
        sold: tier.ticketsSold,
        total: tier.supply,
        revenue: `${tier.revenueSOL} SOL`,
      })),
      attendees,
      checkInRate: Math.round(checkInRate),
      totalAttendees: attendees.length,
      checkedInCount: attendees.filter(a => a.checkedIn).length,
    };

    return frontendEventData;
  } catch (error) {
    console.error(`Error fetching event details for ID ${eventId}:`, error);
    throw error;
  }
};

export const updateEventDetails = async (eventId: string, updateData: UpdateEventInputData): Promise<IEvent | null> => {
  if (!eventId) {
    throw new Error('Event ID is required for update.');
  }

  const existingEvent = await Event.findById(eventId);
  if (!existingEvent) {
    throw new Error('Event not found for update.');
  }

  const simpleUpdatePayload: any = {};

  (Object.keys(updateData) as Array<keyof UpdateEventInputData>).forEach(key => {
    if (key !== 'ticketTiers' && updateData[key] !== undefined) {
      if (key === 'startDate' && updateData.startDate) simpleUpdatePayload.startDate = new Date(updateData.startDate);
      else if (key === 'endDate' && updateData.endDate) simpleUpdatePayload.endDate = new Date(updateData.endDate);
      else simpleUpdatePayload[key] = updateData[key];
    }
  });

  if (updateData.ticketTiers && Array.isArray(updateData.ticketTiers)) {
    const updatedTiers: ITicketTier[] = updateData.ticketTiers.map(tierInput => {
      const existingTier = existingEvent.ticketTiers.find(et => et.name === tierInput.name);
      return {
        name: tierInput.name,
        description: tierInput.description ?? existingTier?.description,
        priceSOL: tierInput.priceSOL ?? existingTier?.priceSOL ?? 0,
        supply: tierInput.supply ?? existingTier?.supply ?? 0,
        perks: tierInput.perks ?? existingTier?.perks,
        resaleAllowed: tierInput.resaleAllowed ?? existingTier?.resaleAllowed ?? true,
        royaltyPercent: tierInput.royaltyPercent ?? existingTier?.royaltyPercent ?? 5,
        ticketsSold: existingTier?.ticketsSold ?? 0,
        revenueSOL: existingTier?.revenueSOL ?? 0,
        purchaseIds: existingTier?.purchaseIds ?? [],
        _id: existingTier?._id ?? new Types.ObjectId(),
      };
    });
    simpleUpdatePayload.ticketTiers = updatedTiers;
    simpleUpdatePayload.totalCapacity = updatedTiers.reduce((sum, tier) => sum + (tier.supply || 0), 0);
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    { $set: simpleUpdatePayload },
    { new: true, runValidators: true }
  ).exec();

  return updatedEvent;
};

export const processPurchase = async (data: PurchaseInputData): Promise<IPurchase> => {
  const { eventId, ticketTierId, purchaserWalletAddress, quantity, transactionSignature } = data;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new Error('Invalid Event ID format.');
  }
  if (!mongoose.Types.ObjectId.isValid(ticketTierId)) {
    throw new Error('Invalid Ticket Tier ID format.');
  }
  if (!purchaserWalletAddress || typeof purchaserWalletAddress !== 'string' || purchaserWalletAddress.trim() === '') {
    throw new Error('Purchaser wallet address is required and must be a non-empty string.');
  }
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error('Quantity must be a positive integer.');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const event = await Event.findById(eventId).session(session).exec();
    if (!event) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(`Event not found for ID: ${eventId}`);
    }

    if (event.status !== 'published') {
      await session.abortTransaction();
      session.endSession();
      throw new Error(`Event "${event.title}" is not currently published for purchases. Status: ${event.status}.`);
    }

    const now = new Date();
    if (event.endDate && event.endTime) {
        const endDateTimeStr = `${event.endDate.toISOString().split('T')[0]}T${event.endTime}`;
        const endDateTime = new Date(endDateTimeStr);
        if (now > endDateTime) {
            await session.abortTransaction();
            session.endSession();
            throw new Error(`Event "${event.title}" has already ended.`);
        }
    } else if (now > event.startDate) {
        // If no end date/time, consider it ended after start date for simplicity here.
    }

    const ticketTier = event.ticketTiers.find(tier => tier._id?.equals(ticketTierId));
    if (!ticketTier) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(`Ticket tier not found for ID: ${ticketTierId} in event "${event.title}".`);
    }

    const ticketsAvailable = ticketTier.supply - ticketTier.ticketsSold;
    if (ticketsAvailable < quantity) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(
        `Not enough tickets available for tier "${ticketTier.name}". Requested: ${quantity}, Available: ${ticketsAvailable}.`
      );
    }

    const pricePerTicketSOL = ticketTier.priceSOL;
    const totalPriceSOL = pricePerTicketSOL * quantity;

    const newPurchaseData: Omit<IPurchase, keyof mongoose.Document | 'purchaseDate' | 'status'> & Partial<Pick<IPurchase, 'transactionSignature' | 'metadata'>> = {
      eventId: new Types.ObjectId(eventId),
      ticketTierId: ticketTier._id as Types.ObjectId,
      purchaserWalletAddress,
      quantity,
      pricePerTicketSOL,
      totalPriceSOL,
      ...(transactionSignature && { transactionSignature }),
    };

    const purchase = new Purchase({
        ...newPurchaseData,
        purchaseDate: new Date(),
        status: 'completed'
    });
    const savedPurchase = await purchase.save({ session });

    event.totalTicketsSold += quantity;
    event.totalRevenueSOL += totalPriceSOL;

    ticketTier.ticketsSold += quantity;
    ticketTier.revenueSOL += totalPriceSOL;
    if (!ticketTier.purchaseIds) {
        ticketTier.purchaseIds = [];
    }
    ticketTier.purchaseIds.push(savedPurchase._id as Types.ObjectId);

    await event.save({ session });

    await session.commitTransaction();
    return savedPurchase;

  } catch (error) {
    await session.abortTransaction();
    console.error('Error processing purchase:', error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('An unexpected error occurred during purchase processing.');
  } finally {
    session.endSession();
  }
};

export const getAllPublicEvents = async (): Promise<IEvent[]> => {
  try {
    const events = await Event.find({ status: 'published' })
      .sort({ startDate: 1 })
      .lean()
      .exec();
    return events as IEvent[];
  } catch (error) {
    console.error("Error fetching all public events:", error);
    throw error;
  }
};

export const getDashboardData = async (organizerWalletAddress: string) => {
  if (!organizerWalletAddress) {
      throw new Error('Organizer wallet address is required.');
  }

  try {
      const now = new Date();
      const events = await Event.find({ organizerWalletAddress }).lean().exec();

      let totalTicketsSold = 0;
      let totalRevenueSOL = 0;
      let totalRoyaltiesEarnedSOL = 0;
      let activeEventsCount = 0;

      const topPerformingEvents: any[] = [];
      const upcomingEvents: any[] = [];
      const issues: any[] = [];

      for (const event of events) {
          totalTicketsSold += event.totalTicketsSold;
          totalRevenueSOL += event.totalRevenueSOL;
          totalRoyaltiesEarnedSOL += event.totalRoyaltiesEarnedSOL;

          const eventEndDateTime = event.endDate && event.endTime
              ? new Date(`${event.endDate.toISOString().split('T')[0]}T${event.endTime}`)
              : null;

          // Determine active events
          if (event.status === 'published' && (!eventEndDateTime || now < eventEndDateTime)) {
              activeEventsCount++;
          }

          // Top Performing Events (e.g., based on revenue or tickets sold, for simplicity, let's use revenue here)
          topPerformingEvents.push({
              name: event.title,
              ticketsSold: event.totalTicketsSold,
              totalCapacity: event.totalCapacity,
              revenue: `${event.totalRevenueSOL} SOL`,
              date: new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              // Add a percentage sold for the progress bar
              percentSold: event.totalCapacity > 0 ? (event.totalTicketsSold / event.totalCapacity) * 100 : 0,
          });

          // Upcoming Events
          if (event.startDate && now < event.startDate) {
              const oneDay = 1000 * 60 * 60 * 24;
              const daysLeft = Math.round(Math.abs((new Date(event.startDate).getTime() - now.getTime()) / oneDay));
              upcomingEvents.push({
                  name: event.title,
                  date: new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                  ticketsSold: event.totalTicketsSold,
                  totalCapacity: event.totalCapacity,
                  daysLeft: daysLeft,
                  percentSold: event.totalCapacity > 0 ? (event.totalTicketsSold / event.totalCapacity) * 100 : 0,
              });
          }

          // Issues/Flags (example: low ticket sales or almost sold out)
          const salesPercentage = event.totalCapacity > 0 ? (event.totalTicketsSold / event.totalCapacity) * 100 : 0;
          if (event.status === 'published') {
              if (salesPercentage < 20 && event.startDate > now) { // Low sales for upcoming events
                  issues.push({
                      event: event.title,
                      issue: `Low ticket sales (${Math.round(salesPercentage)}%)`,
                      severity: "high",
                  });
              } else if (salesPercentage > 80 && salesPercentage < 100) { // Almost sold out
                  issues.push({
                      event: event.title,
                      issue: `Almost sold out (${Math.round(salesPercentage)}%)`,
                      severity: "medium",
                  });
              }
          }
      }

      // Sort top performing events by revenue (descending)
      topPerformingEvents.sort((a, b) => parseFloat(b.revenue) - parseFloat(a.revenue));
      // Sort upcoming events by days left (ascending)
      upcomingEvents.sort((a, b) => a.daysLeft - b.daysLeft);

      // Limit to top 3 for display
      const top3PerformingEvents = topPerformingEvents.slice(0, 3);
      const top3UpcomingEvents = upcomingEvents.slice(0, 3);

      return {
          metrics: [
              {
                  title: "Tickets Sold",
                  value: totalTicketsSold.toLocaleString(),
                  // Change can be calculated based on previous period data, for mock data, just use a placeholder
                  change: "+12%", // Placeholder
                  isPositive: true,
                  icon: "🎫",
              },
              {
                  title: "Total Revenue",
                  value: `${totalRevenueSOL.toFixed(2)} SOL`,
                  change: "+8.5%", // Placeholder
                  isPositive: true,
                  icon: "💸",
              },
              {
                  title: "Royalties Earned",
                  value: `${totalRoyaltiesEarnedSOL.toFixed(2)} SOL`,
                  change: "+5.2%", // Placeholder
                  isPositive: true,
                  icon: "💰",
              },
              {
                  title: "Active Events",
                  value: activeEventsCount.toLocaleString(),
                  change: "0%", // Placeholder
                  isPositive: true,
                  icon: "📍",
              },
          ],
          topEvents: top3PerformingEvents,
          upcomingEvents: top3UpcomingEvents,
          issues: issues,
      };

  } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
  }
};