import React, { useState } from 'react';
import Modal from '../../shared/UIElement/Modal';
import Rating from '@material-ui/lab/Rating';
import { useAuth } from '../../context/auth-context';
import { useHistory } from 'react-router-dom';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import CommentList from '../../users/pages/CommentList';
import { addToCart } from '../../shared/util/addCart';
import SnackBar from '../../shared/UIElement/SnackBar';
import './CategoryItem.css';

export default function CategoryItem(props) {
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [value, setValue] = useState(0);
  const { currentUser } = useAuth();
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    setOpen(false);
  };

  const openRatingModal = () => {
    if (!currentUser) {
      return setLoginModalOpen(true);
    }
    setRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setRatingModalOpen(false);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
  };

  const ratingSubmitHandler = (comment) => {
    props.addComment(props.id, props.name, value, comment);
    setRatingModalOpen(false);
  };

  const onAuthRedirect = (e) => {
    history.push('/auth');
  };

  const addCartHandler = () => {
    if (!currentUser) {
      openLoginModal();
    } else {
      addToCart(currentUser.uid, props, handleClick);
    }
  };

  return (
    <>
      {ratingModalOpen && (
        <CommentList
          open={ratingModalOpen}
          handleClose={closeRatingModal}
          onReviewSubmit={ratingSubmitHandler}
          id={props.id}
        >
          <Rating
            name='simple-controlled'
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
        </CommentList>
      )}

      <Modal
        open={loginModalOpen}
        close={closeLoginModal}
        header='로그인이 필요합니다'
        mainClass='rating__main'
        footer={<button onClick={onAuthRedirect}>confirm</button>}
      >
        {'로그인 페이지로 이동하시겠습니까?'}
      </Modal>
      <li className='category_card'>
        <div className='img_wrap'>
          <img src={props.image} className='product_image' alt='productImg' />
        </div>
        <div className='product_content'>
          <div className='product_content-header'>
            <div className='span'>
              <div className='rating'>
                <Rating
                  name='read-only'
                  value={props.avgRating}
                  readOnly
                  size='small'
                />
              </div>
            </div>
            <p className='product_review' onClick={openRatingModal}>
              별점주기({props.reviewCount})
            </p>
          </div>
          <h3 className='product_name'>
            {props.name.length > 10
              ? `${props.name.slice(0, 11)}..`
              : props.name}
          </h3>

          <p className='product_price'>
            {props.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
          </p>
          <button className='category-cart_btn' onClick={addCartHandler}>
            <span>ADD TO CART</span>
          </button>
          <div className='basket_icon_btn'>
            <ShoppingBasketIcon
              className='basket_icon'
              onClick={addCartHandler}
              style={{ fontSize: '28px' }}
            />
          </div>
        </div>
      </li>
      <SnackBar open={open} close={handleClose}>
        <p style={{ wordBreak: 'keep-all' }}> 장바구니에 담았습니다. </p>
      </SnackBar>
    </>
  );
}
