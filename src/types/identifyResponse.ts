type identifyResponse = {
    contact: responseContact
};

type responseContact = {
    primaryContactId: number,
    emails: string[],
    phoneNumbers: string[],
    secondaryContactIds: number[] 
};

export default identifyResponse;