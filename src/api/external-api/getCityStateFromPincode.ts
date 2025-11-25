export const getCityStateFromPincode = async (pincode: string): Promise<{ city: string; state: string } | null> => {
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        
        if (data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            return {
                city: postOffice.District ?? postOffice.Block.split(' ')[0] ?? postOffice.Division.split(' ')[0],
                state: postOffice.State,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching city and state from pincode:", error);
        return null;
    }
}