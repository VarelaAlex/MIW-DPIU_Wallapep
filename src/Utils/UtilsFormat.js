export let getCardNumber = (card) => {
    let last4Digits = card?.slice(-4);
    return last4Digits?.padStart(card?.length, "*");
}