import execute from "../db/postgres";
import identifyInput from "../types/identifyRequest";
import identifyResponse from "../types/identifyResponse";

async function identifyUser(reqInput: identifyInput): Promise<identifyResponse> {

    let records = await execute("SELECT * FROM Contact WHERE phoneNumber=? OR email=?", [reqInput.email, reqInput.phone]);

    if (records.rowCount == 0) {

        let res = await execute("SELECT MAX(Id) FROM Contact", []);

        await execute(
            "INSERT INTO Contact (phoneNumber, email, linkedId, linkedPrecedence) VALUES(?,?,?,?,?)",
            [
                reqInput.phone,
                reqInput.email,
                null,
                "primary"
            ]
        );

        let resObj: identifyResponse = {
            contact: {
                primaryContactId: res.rows[0][0] + 1,
                emails: [reqInput.email],
                phoneNumbers: [reqInput.phone],
                secondaryContactIds: []
            }
        }

        return resObj;

    } else {

        let resObj: identifyResponse = {
            contact: {
                primaryContactId: records.rows[0][0],
                emails: [],
                phoneNumbers: [],
                secondaryContactIds: []
            }
        };

        records.rows.forEach(row => {

            if (row[7] != null) {

                if (row[0] != resObj.contact.primaryContactId && row[4] == "primary") {
                    execute(
                        "UPDATE Contact SET linkedPrecedence=\"secondary\", linkedId=? WHERE Id=?",
                        [
                            resObj.contact.primaryContactId,
                            row[0]
                        ]
                    );
                }

                if (row[0] != resObj.contact.primaryContactId) resObj.contact.secondaryContactIds.push(row[0]);
                if (row[1]! in resObj.contact.phoneNumbers && row[1] != null) resObj.contact.phoneNumbers.push(row[1]);
                if (row[2]! in resObj.contact.emails && row[2] != null) resObj.contact.emails.push(row[2]);
            }

        });

        return resObj;
    }
}

export default identifyUser;