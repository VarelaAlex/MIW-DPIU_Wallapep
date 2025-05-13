import {checkURL} from "./UtilsChecks";

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
}

export let getProductsWithImage = async () => {
    let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/products`, {
        method: "GET", headers: {
            "apikey": localStorage.getItem("apiKey")
        },
    });

    if (response.ok) {
        let jsonData = await response.json();
        return await Promise.all(jsonData.map(async (p) => {
            let urlImage = `${process.env.REACT_APP_BACKEND_BASE_URL}/images/${p.id}.png`;
            let existsImage = await checkURL(urlImage);
            p.image = existsImage ? urlImage : "/imageMockup.png";
            return p;
        }));
    } else {
        let responseBody = await response.json();
        responseBody.errors.forEach(e => {
            console.log("Error: " + e.msg);
        });
    }
}

export let getProductById = async (id) => {
    let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + id, {
        method: "GET", headers: {
            "apikey": localStorage.getItem("apiKey")
        },
    });

    if (response.ok) {
        let product = await response.json();
        product.sellerEmail = (await getUser(product.sellerId)).email;
        let urlImage = `${process.env.REACT_APP_BACKEND_BASE_URL}/images/${product.id}.png`;
        let existsImage = await checkURL(urlImage);
        product.image = existsImage ? urlImage : "/imageMockup.png";
        return product;
    } else {
        let responseBody = await response.json();
        let serverErrors = responseBody.errors;
        serverErrors.forEach(e => {
            console.log("Error: " + e.msg)
        })
    }
}

export let uploadImage = async (productId, image) => {
    let formDataImage = new FormData();
    formDataImage.append('image', image);

    let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + productId + "/image", {
        method: "POST", headers: {
            "apikey": localStorage.getItem("apiKey")
        }, body: formDataImage
    })
    if (response.ok) {

    } else {
        let responseBody = await response.json();
        let serverErrors = responseBody.errors;
        serverErrors.forEach(e => {
            console.log("Error: " + e.msg)
        })
    }
}

export let editProduct = async (id, formData) => {
    let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + id, {
        method: "PUT", headers: {
            "Content-Type": "application/json", "apikey": localStorage.getItem("apiKey")
        }, body: JSON.stringify(formData)
    });

    if (response.ok) {
        if(formData.image && formData.image[0].uid !== "-1") {
            await uploadImage(id, formData.image);
        }
        return {ok: true};
    } else {
        return await response.json();
    }
}

export let getCreditCardNumber = async (creditCardId) => {
    let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/creditCards/${creditCardId}`, {
        method: "GET", headers: {
            "apikey": localStorage.getItem("apiKey")
        }
    });

    if (response.ok) {
        let jsonData = await response.json();
        return jsonData.number;
    } else {
        let responseBody = await response.json();
        responseBody.errors.forEach(e => {
            console.log("Error: " + e.msg);
        });
    }
}