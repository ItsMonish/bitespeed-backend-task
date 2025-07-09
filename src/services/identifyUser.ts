import execute from "../db/postgres";
import identifyInput from "../types/identifyRequest";
import identifyResponse from "../types/identifyResponse";

async function identifyUser(reqInput: identifyInput): Promise<identifyResponse> {

    let records = await execute(
        "SELECT COUNT(*), MIN(id) as minid, MIN(linkedid) as minlinked FROM Contact WHERE phoneNumber=$1 OR email=$2", 
        [
            reqInput.phone, 
            reqInput.email
        ]
    );
    let res = await execute("SELECT MAX(id) FROM Contact", []);

    if (records.rows[0].count == 0) {

        await execute(
            "INSERT INTO Contact (phoneNumber, email, linkedId, linkprecedence) VALUES($1,$2,$3,$4)",
            [
                reqInput.phone,
                reqInput.email,
                null,
                "primary"
            ]
        );

        let resObj: identifyResponse = {
            contact: {
                primaryContactId: res.rows[0].max + 1,
                emails: [reqInput.email],
                phoneNumbers: [reqInput.phone],
                secondaryContactIds: []
            }
        }

        return resObj;

    } else {

        let recordsByEmail = await execute("SELECT * FROM Contact WHERE email=$1", [reqInput.email]);
        let recordsByNumber = await execute("SELECT * FROM Contact WHERE phoneNumber=$1", [reqInput.phone]);

        let resObj: identifyResponse = {
            contact: {
                primaryContactId: Math.min(records.rows[0].minid, records.rows[0].minlinked ?? records.rows[0].minid),
                emails: [],
                phoneNumbers: [],
                secondaryContactIds: []
            }
        };


        if (
            (reqInput.email != "" && recordsByEmail.rowCount == 0) ||
            (reqInput.phone != "" && recordsByNumber.rowCount == 0)
        ) {
            await execute(
                "INSERT INTO Contact (phoneNumber, email, linkedId, linkprecedence) VALUES($1,$2,$3,$4)",
                [
                    reqInput.phone,
                    reqInput.email,
                    Math.min(recordsByNumber.rows[0]?.id ?? recordsByEmail.rows[0]?.id, recordsByEmail.rows[0]?.id ?? recordsByNumber.rows[0]?.id),
                    "secondary"
                ]
            );

            if (reqInput.email != "") resObj.contact.emails.push(reqInput.email);
            if (reqInput.phone != "") resObj.contact.phoneNumbers.push(reqInput.phone);
        }

        recordsByEmail.rows.forEach(row => {
            if (row.deletedat == null) {
                if (row.id != resObj.contact.primaryContactId && row.linkprecedence == "primary") {
                    execute(
                        "UPDATE Contact SET linkprecedence='secondary', linkedId=$1 WHERE Id=$2",
                        [
                            resObj.contact.primaryContactId,
                            row.id
                        ]
                    );
                }
            }
        });

        recordsByNumber.rows.forEach(row => {
            if (row.deletedat == null) {
                if (row.id != resObj.contact.primaryContactId && row.linkprecedence == "primary") {
                    execute(
                        "UPDATE Contact SET linkprecedence='secondary', linkedId=$1 WHERE Id=$2",
                        [
                            resObj.contact.primaryContactId,
                            row.id
                        ]
                    );
                }
            }
        });

        records = await execute(
            "SELECT id, email, phoneNumber FROM Contact WHERE (linkedId=$1 OR Id=$1) AND deletedat IS NOT NULL",
            [resObj.contact.primaryContactId]
        );

        records.rows.forEach(row => {
            if (row.id != resObj.contact.primaryContactId)
                resObj.contact.secondaryContactIds.push(row.id);
            if (row.phonenumber != null && !resObj.contact.phoneNumbers.includes(row.phonenumber))
                resObj.contact.phoneNumbers.push(row.phonenumber);
            if (row.email != null && !resObj.contact.emails.includes(row.email))
                resObj.contact.emails.push(row.email);
        });

        return resObj;
    }
}

export default identifyUser;