export let getUser = async (id) => {
    let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users/${id}`, {
        method: "GET",
    });

    if (response.ok) {
        return await response.json();
    } else {
        let responseBody = await response.json();
        responseBody.errors.forEach(e => {
            console.log("Error: " + e.msg);
        });
    }
}

export let getTransactions = async (showAsBuyer, id) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/transactions/public?${showAsBuyer ? `buyerId=${id}` : `sellerId=${id}`}`, {
        method: 'GET', headers: {
            apikey: localStorage.getItem("apiKey")
        }
    });

    if (response.ok) {
        return await response.json();
    } else {
        let responseBody = await response.json();
        let serverErrors = responseBody.errors;
        serverErrors.forEach(e => {
            console.log("Error: " + e.msg)
        })
    }
};