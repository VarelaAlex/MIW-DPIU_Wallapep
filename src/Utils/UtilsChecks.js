export let checkURL = async (url) => {
    try {
        let response = await fetch(url);
        console.log(response.ok)
        return response.ok; // Returns true if the status is in the 200-299 range.
    } catch (error) {
        return false; // URL does not exist or there was an error.
    }
}