CREATE TABLE Contact (
    Id              SERIAL PRIMARY KEY,
    phoneNumber     VARCHAR(20),
    email           VARCHAR(50),
    linkedId        INT,
    linkPrecedence  VARCHAR(10) NOT NULL,
    createdAt       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deletedAt       TIMESTAMPTZ DEFAULT NULL
);

INSERT INTO Contact (phoneNumber, email, linkedId, linkPrecedence)
VALUES 
    ('123456789', 'person1@example.com', NULL, 'primary'),
    ('987654321', 'person2@example.com', NULL, 'primary'),
    ('521478963', 'person2@example.com', NULL, 'secondary'),
    ('123456789', 'person3@example.com', NULL, 'secondary'),
    ('369852147', 'person4@example.com', NULL, 'primary');

CREATE OR REPLACE FUNCTION createdTriggerFunction() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.createdAt = CURRENT_TIMESTAMP; 
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION updateTriggerFunction() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP; 
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER createdAtTrigger
BEFORE INSERT ON Contact
FOR EACH ROW
EXECUTE FUNCTION createdTriggerFunction();

CREATE TRIGGER updatedAtTrigger
BEFORE UPDATE ON Contact
FOR EACH ROW
EXECUTE FUNCTION updateTriggerFunction();