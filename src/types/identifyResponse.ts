type identifyResponse = {
    contact: responseContact
};

type responseContact = {
    primaryContactId: Number,
    emails: string[],
    phoneNumbers: string[],
    secondaryContactIds: Number[] 
};

export default identifyResponse;