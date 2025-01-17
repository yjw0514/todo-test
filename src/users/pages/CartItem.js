import React from 'react';
import { useAuth } from '../../context/auth-context';
import { dbService } from '../../firebase';
import './CartItem.css';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

export default function CartItem(props) {
  const { currentUser } = useAuth();
  const cartRef = dbService.doc(`/cart/${currentUser.uid}`);

  const deleteHandler = () => {
    props.updateCurrentProduct(props.id);
    cartRef
      .get()
      .then((doc) => {
        let newProducts = [];
        newProducts = doc
          .data()
          .products.filter((el) => el.productId !== props.id);

        cartRef.update({ products: newProducts });
      })
      .catch((err) => console.log(err));
    props.updateCurrentProduct(props.id);
  };

  const minusHnadler = () => {
    cartRef
      .get()
      .then((doc) => {
        let newProducts = [];
        newProducts = doc.data().products;

        const sameIndex = doc
          .data()
          .products.findIndex((el) => el.productId === props.id);

        //isChecked
        if (newProducts[sameIndex].isChecked === true) {
          props.setTotal(props.total - newProducts[sameIndex].price);
        }

        //is not Checked
        if (newProducts[sameIndex].quantity > 0) {
          newProducts[sameIndex].quantity--;
          cartRef.update({ products: newProducts });
        } else {
          return;
        }
      })
      .catch((err) => console.log(err));
  };

  const plusHnadler = () => {
    cartRef
      .get()
      .then((doc) => {
        let newProducts = [];
        newProducts = doc.data().products;
        const sameIndex = doc
          .data()
          .products.findIndex((el) => el.productId === props.id);

        //isChecked
        if (newProducts[sameIndex].isChecked === true) {
          props.setTotal(props.total + newProducts[sameIndex].price);
        }

        //is not Checked
        newProducts[sameIndex].quantity++;
        cartRef.update({ products: newProducts });
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <tr>
        <td className='cart_td'>
          <input
            type='checkbox'
            name='checkbox'
            id={props.index}
            onChange={(e) =>
              props.handleSingleCheck(e.target.checked, props.id)
            }
            checked={props.checkItems.includes(props.id) ? true : false}
          />
        </td>
        <td className='cart_td'>
          <img src={props.image} className='cart_img' alt='cart-product' />
        </td>
        <td className='cart_td'>
          <p className='cart_name'>{props.name}</p>
        </td>
        <td className='cart_td'>
          <button className='minus' onClick={minusHnadler}>
            –
          </button>
          <span>{props.quantity}</span>
          <button className='plus' onClick={plusHnadler}>
            +
          </button>
        </td>
        <td className='cart_td'>
          ₩
          {(props.price * props.quantity)
            .toString()
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
        </td>
        <td className='cart_td'>
          {/* <button className="deleteBtn" onClick={deleteHandler}>
            <span>×</span>
          </button> */}
          <Tooltip title='Delete'>
            <IconButton
              aria-label='delete'
              className='deleteBtn'
              onClick={deleteHandler}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </td>
      </tr>
    </>
  );
}
