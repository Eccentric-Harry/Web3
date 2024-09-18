// let arr = [255,127,0,3033];
// let bytes = new Uint8Array(arr);
// console.log(bytes);
// console.log(new Uint16Array(arr));

// // bytes to ASCII
// for(let i = 0; i < arr.length; i++){
//     console.log((int) arr[i]);
// }


// const numbers = [1,2,3,4,5];
// const doubled = numbers.map(double);

// function double(value, index, arr){
//     return value * 2;
// }
// console.log(doubled);


const products = [
    {
        name: 'laptop',
        price: 1000,
        count: 5
    },
    {
        name: 'desktop',
        price: 1500,
        count: 2
    },
    {
        name: 'phone',
        price: 500,
        count: 10
    }
]

const prices = products.map(product => ({name: product.name, totalPrice: product.price*product.count}));
console.log(prices);


const numbers = [61,62,63,64,65];
const converter = (numbers) => (
    numbers.map(byte => String.fromCharCode(byte))
)
console.log(converter(numbers));