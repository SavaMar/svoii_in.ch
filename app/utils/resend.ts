import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  console.warn(
    "RESEND_API_KEY is not set. Newsletter functionality will be disabled.",
  );
}

export interface ContactData {
  email: string;
  firstName?: string;
  lastName?: string;
  unsubscribed?: boolean;
}

export interface AudienceData {
  name: string;
}

// Create or get audience for newsletter subscribers
export async function getOrCreateAudience(
  audienceName: string = "Newsletter Subscribers",
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    console.log("Getting or creating audience:", audienceName);

    // First, try to list existing audiences to find the one we want
    const { data: audiences } = await resend.audiences.list();
    console.log("Listed audiences:", audiences);

    // Look for existing audience with the same name
    const existingAudience = audiences?.data?.find((audience) =>
      audience.name === audienceName
    );

    if (existingAudience) {
      console.log("Found existing audience:", existingAudience);
      return existingAudience;
    }

    console.log("Creating new audience:", audienceName);

    // If not found, create a new audience
    const { data: newAudience, error } = await resend.audiences.create({
      name: audienceName,
    });

    console.log("Audience creation result:", { newAudience, error });

    if (error) {
      console.error("Error creating audience:", error);
      throw new Error("Failed to create audience");
    }

    return newAudience;
  } catch (error) {
    console.error("Error in getOrCreateAudience:", error);
    throw error;
  }
}

// Add contact to newsletter audience
export async function addContactToNewsletter(
  contactData: ContactData,
  audienceName: string = "Newsletter Subscribers",
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    console.log("Adding contact to newsletter:", contactData);

    // Get or create the audience
    const audience = await getOrCreateAudience(audienceName);
    console.log("Got audience:", audience);

    if (!audience?.id) {
      throw new Error("Failed to get audience ID");
    }

    // Add the contact to the audience
    const { data: contact, error } = await resend.contacts.create({
      email: contactData.email,
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      unsubscribed: contactData.unsubscribed || false,
      audienceId: audience.id,
    });

    console.log("Resend contact creation result:", { contact, error });

    if (error) {
      console.error("Error adding contact:", error);
      throw new Error("Failed to add contact to newsletter");
    }

    return contact;
  } catch (error) {
    console.error("Error in addContactToNewsletter:", error);
    throw error;
  }
}

// Remove contact from newsletter audience
export async function removeContactFromNewsletter(
  email: string,
  audienceName: string = "Newsletter Subscribers",
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Get the audience
    const audience = await getOrCreateAudience(audienceName);

    if (!audience?.id) {
      throw new Error("Failed to get audience ID");
    }

    // List contacts in the audience to find the one to remove
    const { data: contacts } = await resend.contacts.list({
      audienceId: audience.id,
    });

    const contactToRemove = contacts?.data?.find((contact) =>
      contact.email === email
    );

    if (!contactToRemove?.id) {
      throw new Error("Contact not found in audience");
    }

    // Remove the contact
    const { error } = await resend.contacts.remove({
      id: contactToRemove.id,
      audienceId: audience.id,
    });

    if (error) {
      console.error("Error removing contact:", error);
      throw new Error("Failed to remove contact from newsletter");
    }

    return true;
  } catch (error) {
    console.error("Error in removeContactFromNewsletter:", error);
    throw error;
  }
}

// Update contact subscription status
export async function updateContactSubscription(
  email: string,
  unsubscribed: boolean,
  audienceName: string = "Newsletter Subscribers",
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Get the audience
    const audience = await getOrCreateAudience(audienceName);

    if (!audience?.id) {
      throw new Error("Failed to get audience ID");
    }

    // List contacts in the audience to find the one to update
    const { data: contacts } = await resend.contacts.list({
      audienceId: audience.id,
    });

    const contactToUpdate = contacts?.data?.find((contact) =>
      contact.email === email
    );

    if (!contactToUpdate?.id) {
      throw new Error("Contact not found in audience");
    }

    // Update the contact
    const { data: updatedContact, error } = await resend.contacts.update({
      id: contactToUpdate.id,
      audienceId: audience.id,
      unsubscribed,
    });

    if (error) {
      console.error("Error updating contact:", error);
      throw new Error("Failed to update contact subscription");
    }

    return updatedContact;
  } catch (error) {
    console.error("Error in updateContactSubscription:", error);
    throw error;
  }
}
