import React, {useEffect, useRef, useState} from "react";
import {Button, notification} from "antd";
import {checkURL} from "../UtilsChecks";

export let useMyProducts = (openCustomNotification) => {

    let [products, setProducts] = useState([])
    let [filteredProducts, setFilteredProducts] = useState([]);
    let [stats, setStats] = useState({soldCount: 0, totalIncome: 0});
    let deletionTimeoutRef = useRef(null);
    let deletionCancelledRef = useRef(false);

    let handleSearch = (e) => {
        let text = e.target.value.toLowerCase();
        setFilteredProducts(products.filter((product) => product.title.toLowerCase().includes(text) || product.description?.toLowerCase().includes(text)));
    };

    let updateStatistics = (productsList) => {
        let soldProducts = productsList.filter(product => product.buyerId != null);
        let soldCount = soldProducts.length;
        let totalIncome = soldProducts.reduce((sum, product) => sum + (product.price || 0), 0);
        setStats({soldCount, totalIncome});
    };

    useEffect(() => {

        let getMyProducts = async () => {
            let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products/own/", {
                method: "GET", headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

            if (response.ok) {
                let jsonData = await response.json();
                jsonData.map(product => {
                    product.key = product.id
                    return product
                })
                await Promise.all(jsonData.map(async (p) => {
                    let urlImage = `${process.env.REACT_APP_BACKEND_BASE_URL}/images/${p.id}.png`;
                    let existsImage = await checkURL(urlImage);
                    p.image = existsImage ? urlImage : "/imageMockup.png";
                    return p;
                }));
                setProducts(jsonData)
                setFilteredProducts(jsonData);
                updateStatistics(jsonData);
            } else {
                let responseBody = await response.json();
                let serverErrors = responseBody.errors;
                serverErrors.forEach(e => {
                    console.log("Error: " + e.msg)
                })
            }
        }

        getMyProducts();
    }, [])

    let undoDelete = (key) => {
        deletionCancelledRef.current = true;
        clearTimeout(deletionTimeoutRef.current);
        notification.destroy(key);
        deletionTimeoutRef.current = null;
        openCustomNotification("top", "Se ha cancelado la eliminación del producto", "info")
    };

    let deleteMultipleProducts = (ids) => {
        let deletableIds = ids.filter(id => {
            let product = products.find(p => p.id === id);
            return product && !product.buyerId;
        });

        if (deletableIds.length === 0) {
            openCustomNotification("top", "Ninguno de los productos seleccionados puede eliminarse", "warning");
            return;
        }

        let key = `bulkDelete${Date.now()}`;
        deletionCancelledRef.current = false;

        notification.open({
            message: "Productos eliminados",
            description: `Los productos serán eliminados en 3 segundos. Haz clic en "Deshacer" para cancelar.`,
            duration: 3,
            placement: "top",
            actions: <Button type="primary" onClick={() => undoDelete(key)}>Deshacer</Button>,
            key,
            onClose: () => {
                if (!deletionCancelledRef.current) {
                    confirmDeleteMultiple(deletableIds);
                }
            },
            showProgress: true,
            pauseOnHover: false,
        });

        deletionTimeoutRef.current = setTimeout(() => {
            confirmDeleteMultiple(deletableIds);
            notification.destroy(key);
        }, 3000);
    };

    let confirmDeleteMultiple = async (ids) => {
        let deletePromises = ids.map(async (id) => {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/products/${id}`, {
                method: "DELETE", headers: {
                    "apikey": localStorage.getItem("apiKey"),
                },
            });

            if (response.ok) {
                let jsonData = await response.json();
                if (jsonData.deleted) {
                    return id;
                }
            } else {
                let responseBody = await response.json();
                responseBody.errors?.forEach(e => {
                    console.log("Error: " + e.msg);
                });
            }
            return null;
        });

        let results = await Promise.all(deletePromises);
        let successfullyDeletedIds = results.filter(id => id !== null);

        if (successfullyDeletedIds.length > 0) {
            setProducts((prev) => {
                return prev.filter(p => !successfullyDeletedIds.includes(p.id));
            });

            setFilteredProducts((prev) => prev.filter(p => !successfullyDeletedIds.includes(p.id)));

            openCustomNotification("top", "Se han eliminado los productos seleccionados", "success");
        }
    };

    return {
        products, filteredProducts, stats, setProducts, setFilteredProducts, handleSearch, deleteMultipleProducts
    };
}