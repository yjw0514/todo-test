import React, { useEffect, useState } from "react";
import "./ShoppingCart.css";
import Container from "@material-ui/core/Container";
import { useAuth } from "../../context/auth-context";
import { dbService } from "../../firebase";
import CartItem from "./CartItem";

export default function ShoppingCart() {
  const [cartProducts, setCartProducts] = useState([]);
  const { currentUser } = useAuth();
  const [checkItems, setCheckItems] = useState([]);
  const [total, setTotal] = useState(0);

  const cartRef = dbService.collection("cart").doc(currentUser.uid);
  const buyRef = dbService.doc(`/buy/${currentUser.uid}`);

  useEffect(() => {
    const cartRef = dbService.collection("cart").doc(currentUser.uid);
    cartRef.onSnapshot((doc) => {
      if (doc.exists) {
        setCartProducts(doc.data().products);
      }
    });
  }, [currentUser.uid]);

  const calcTotal = (products) => {
    let total = 0;
    products.forEach((el, i) => {
      if (products[i].isChecked === true) {
        total += products[i].price * products[i].quantity;
      }
    });
    setTotal(total);
  };

  const checkoutHandler = () => {
    cartRef
      .get()
      .then((doc) => {
        if (!doc.exists || doc.data().products.length === 0) {
          return alert("장바구니가 비어있습니다.");
        } else {
          let newProducts = [];
          newProducts = doc.data().products.filter((el) => {
            return !checkItems.includes(el.productId);
          });

          cartRef.update({ products: newProducts });

          const items = doc.data().products.filter((el) => {
            return checkItems.includes(el.productId);
          }); //구매한 상품

          let itemsWithDate = [
            { products: [...items], date: new Date().toISOString() },
          ];
          buyRef.get().then((doc) => {
            if (doc.exists) {
              let buyProducts = [];
              buyProducts = doc.data().itemsWithDate;
              itemsWithDate.forEach((el) => buyProducts.push(el));
              // buyProducts.push(itemsWithDate);
              buyRef.update({ itemsWithDate: buyProducts });
            } else {
              buyRef.set({
                itemsWithDate,
              });
            }
          });
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSingleCheck = (checked, id) => {
    if (checked) {
      setCheckItems([...checkItems, id]);

      cartRef.get().then((doc) => {
        let cartProducts = doc.data().products;
        const sameIndex = cartProducts.findIndex((el) => el.productId === id);
        cartProducts[sameIndex].isChecked = true;
        cartRef.update({ products: cartProducts });
        // let total = 0;
        // cartProducts.forEach((el, i) => {
        //   if (cartProducts[i].isChecked === true) {
        //     total += cartProducts[i].price * cartProducts[i].quantity;
        //   }
        // });
        // setTotal(total);
        calcTotal(cartProducts);
      });
    } else {
      // 체크 해제
      setCheckItems(checkItems.filter((el) => el !== id));
      cartRef.get().then((doc) => {
        let cartProducts = doc.data().products;
        const sameIndex = cartProducts.findIndex((el) => el.productId === id);
        cartProducts[sameIndex].isChecked = false;
        cartRef.update({ products: cartProducts });

        calcTotal(cartProducts);
      });
    }
  };

  const checkAllHandler = (checked) => {
    if (checked) {
      const idArray = [];
      cartProducts.forEach((el, id) => {
        idArray.push(el.productId);
      });
      cartRef.get().then((doc) => {
        let cartProducts = doc.data().products;
        cartProducts.forEach((el) => (el.isChecked = true));
        cartRef.update({ products: cartProducts });

        calcTotal(cartProducts);
      });

      setCheckItems(idArray);
    } else {
      setCheckItems([]);
      cartRef.get().then((doc) => {
        let cartProducts = doc.data().products;
        cartProducts.forEach((el) => (el.isChecked = false));
        cartRef.update({ products: cartProducts });

        calcTotal(cartProducts);
      });
    }
  };

  return (
    <div>
      <Container maxWidth="lg">
        <div className="shopping_cart_wrap">
          <section className="shopping_cart">
            <h2>Your Shopping Bag</h2>
            <table className="cart_table">
              {/* table title */}
              <thead>
                <tr>
                  <th className="checkboxAll cart_th">
                    <input
                      type="checkbox"
                      name="checkboxAll"
                      id="checkAll"
                      onChange={(e) => checkAllHandler(e.target.checked)}
                      checked={
                        checkItems.length === cartProducts.length ? true : false
                      }
                    />
                    <label htmlFor="checkAll">선택</label>
                  </th>
                  <th className="cart_th">Item</th>
                  <th className="cart_th"></th>
                  <th className="cart_th">Quantity</th>
                  <th className="cart_th">Price</th>
                  <th className="cart_th">삭제</th>
                </tr>
              </thead>
              {/* table content */}
              <tbody>
                {cartProducts &&
                  cartProducts.map((product, index) => (
                    <CartItem
                      key={product.productId}
                      id={product.productId}
                      name={product.productName}
                      price={product.price}
                      image={product.image}
                      quantity={product.quantity}
                      index={index}
                      checkItems={checkItems}
                      setCheckItems={setCheckItems}
                      handleSingleCheck={handleSingleCheck}
                      total={total}
                      setTotal={setTotal}
                    />
                  ))}
              </tbody>
            </table>
            {/* total */}
            <div className="checkout">
              <div className="total">
                <div className="total_inner">
                  <p>Total :</p>
                  <p>
                    ₩{" "}
                    {total
                      .toString()
                      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                  </p>
                </div>
                <button className="total_btn" onClick={checkoutHandler}>
                  <span>Secure Checkout</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
