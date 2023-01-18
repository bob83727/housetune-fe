import { Link } from 'react-router-dom';
import BreadCrumb from '../Layout/BreadCrumb';
import './Products.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';

// 購物車
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../utils/useCart';

function Products() {
  const [products, setProducts] = useState([]);

  // 儲存 select 狀態
  const [shape, setShape] = useState('');
  const [amount, setAmount] = useState('');
  // 抓取點擊購物車的資料
  const [cart, setCart] = useState([]);

  function Number(min, max) {
    const array = [];
    for (let i = min; i <= max; i++) {
      array.push(i);
    }
    return array;
  }

  useEffect(() => {
    async function getProducts() {
      let res = await axios.get('http://localhost:3001/products');
      // console.log(res);
      setProducts(res.data);
    }
    getProducts();
  }, []);

  // 購物車
  const navigate = useNavigate();
  const { addItem, items } = useCart();

  function addToCart() {
    const item = {
      ...cart,
      quantity: parseInt(amount, 10),
    };
    // 判斷購買數量超過庫存 則不能再加進購物車
    console.log(item);
    console.log(items);

    // addItem({
    //   ...item,
    //   id: item.prod_id + `-${shape}`,
    //   shape: shape,
    // });

    let overBuy = false;
    let buyingItemIndex;
    // 判斷 選取的產品 購買數量不超過庫存
    // cart.amount 是庫存
    // items[i].quantity 是購物車該項目的數量

    // 購物車為空直接 + 進去
    if (items.length === 0) {
      addItem({
        ...item,
        id: item.prod_id + `-${shape}`,
        shape: shape,
      });
    }
    // 確認有沒有這筆商品的 id
    let found = items.find((obj) => {
      return obj.id === item.prod_id + `-${shape}`;
    });
    // 沒找到 => 加進去
    if (found === undefined) {
      console.log(`新增商品 ${item.prod_id + '-' + shape}`);
      addItem({
        ...item,
        id: item.prod_id + `-${shape}`,
        shape: shape,
      });
      console.log('新增成功');
      alert('新增成功');
    } else {
      for (let i in items) {
        console.log(items[i]);
        // 單純判斷 id
        if (items[i].id === item.prod_id + `-${shape}`) {
          console.log(
            `檢查到相同id items[i].id : ${items[i].id} , item.prod_id : ${
              item.prod_id + `-${shape}`
            }`
          );
          if (items[i].quantity === cart.amount) {
            console.log('購買數量已達上限');
            alert('購買數量已達上限');
            overBuy = true;
            buyingItemIndex = i;
          } else {
            console.log(`還能購買 ${cart.amount - items[i].quantity} 個`);
            overBuy = false;
            buyingItemIndex = i;
            confirmAmounts();
          }
        }
      }
    }

    // 如果超過庫存數 不要 addItem
    // console.log(overBuy);
    // console.log('確認index', buyingItemIndex);

    function confirmAmounts() {
      if (overBuy === false) {
        // 購物車 + 選取 <= 庫存 => 可以新增
        // 購物車 + 選取 > 庫存 => 新增失敗
        if (+amount + items[buyingItemIndex].quantity > +cart.amount) {
          console.log(
            `無法新增這麼多數量 選取數量:${amount} , 購物車裡的數量 ${items[buyingItemIndex].quantity} 庫存數${cart.amount}`
          );
          alert('新增失敗 請重新選擇數量');
        } else {
          console.log(
            `新增成功 選取數量:${+amount} , 購物車裡的數量 ${+items[
              buyingItemIndex
            ].quantity} -- 庫存數${cart.amount} 新增後數量 => ${
              +amount + items[buyingItemIndex].quantity
            }`
          );
          addItem({
            ...item,
            id: item.prod_id + `-${shape}`,
            shape: shape,
          });
          alert('新增成功');
        }
      }
    }
  }

  return (
    <>
      <main className="bg-orange product">
        <div className="container">
          <BreadCrumb />
          <h3 className="mb-5 text-info-dark">新品推薦/New Arrival</h3>
          <div className="d-flex justify-content-between border-0">
            {/* 左側條件設定 */}
            <div className="col-2 d-none d-lg-block ">
              <h5 className="text-info">條件設定</h5>
              <hr className="simple" />
              <div className="accordion accordion-flush">
                {/* 供貨情況 */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingOne"
                  >
                    <button
                      className="accordion-button bg-orange ps-0"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseOne"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseOne"
                    >
                      供貨情況
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-headingOne"
                  >
                    <div className="accordion-body bg-orange ps-0">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label fs-sml text-info"
                          htmlFor="flexCheckDefault"
                        >
                          有庫存(180)
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckChecked"
                        />
                        <label
                          className="form-check-label fs-sml text-info"
                          htmlFor="flexCheckChecked"
                        >
                          無庫存(3)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 價格 */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingTwo"
                  >
                    <button
                      className="accordion-button collapsed bg-orange ps-0"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseTwo"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseTwo"
                    >
                      價格
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingTwo"
                  >
                    <div className="accordion-body bg-orange ps-0">
                      <div className="d-flex pb-2 align-items-center">
                        <h6 className="px-1 text-primary-200 mb-0 fs-sml">$</h6>
                        <input
                          type="number"
                          name="points"
                          min="0"
                          max="10"
                          value=""
                          placeholder="From"
                          className="w-100 fs-sml"
                        />
                      </div>
                      <div className="d-flex align-items-center">
                        <h6 className="px-1 text-primary-200 mb-0 fs-sml">$</h6>
                        <input
                          type="number"
                          name="points"
                          min="0"
                          max="10"
                          value=""
                          placeholder="To"
                          className="w-100 fs-sml"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* 分類 */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingThree"
                  >
                    <button
                      className="accordion-button collapsed bg-orange ps-0"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseThree"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseThree"
                    >
                      分類
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingThree"
                  >
                    <div className="accordion-body bg-orange ps-0">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label text-info fs-sml"
                          htmlFor="flexCheckDefault"
                        >
                          沙發(10)
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label text-info fs-sml"
                          htmlFor="flexCheckDefault"
                        >
                          椅子(3)
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label text-info fs-sml"
                          htmlFor="flexCheckDefault"
                        >
                          桌子(15)
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label text-info fs-sml"
                          htmlFor="flexCheckDefault"
                        >
                          櫥櫃(8)
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label text-info fs-sml"
                          htmlFor="flexCheckDefault"
                        >
                          床 (11)
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label text-info fs-sml"
                          htmlFor="flexCheckDefault"
                        >
                          燈(2)
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label text-info fs-sml"
                          htmlFor="flexCheckDefault"
                        >
                          紡織(6)
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label text-info fs-sml"
                          htmlFor="flexCheckDefault"
                        >
                          裝飾(12)
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label text-info fs-sml"
                          htmlFor="flexCheckDefault"
                        >
                          廚具(20)
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label text-info fs-sml"
                          htmlFor="flexCheckDefault"
                        >
                          浴室(18)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右側排序、商品列表 */}
            <div className="col-12 col-lg-9 ">
              {/* 條件設定、排序依據 */}
              <div className="d-flex">
                {/* 條件設定 */}
                <div className="d-flex align-items-center d-md-none">
                  <div className="pe-3">
                    <button
                      className="text-info-dark ps-0 col border-0 bg-orange"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModalFilter"
                    >
                      <span className="d-md-none d-inline">
                        <i className="fa-solid fa-filter"></i>
                      </span>
                      條件設定
                    </button>
                  </div>
                </div>
                {/* 排序依據 */}
                <div className="d-flex align-items-center">
                  <div className="pe-3 d-block d-md-none">
                    <button
                      className="text-info-dark ps-0 col border-0 bg-orange"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModalSort"
                    >
                      <span>
                        <i className="fa-solid fa-sort"></i>{' '}
                      </span>
                      排序依據
                    </button>
                  </div>
                  <div className="pe-3 d-none d-md-block">
                    <h6 className="text-info-dark ps-0 col">排序依據</h6>
                  </div>
                  <div className="d-none d-md-block">
                    <select
                      className="form-select-xl mb-2 text-gray-300 fs-sml"
                      aria-label="Default select example"
                    >
                      <option disabled>精選</option>
                      <option value="1">暢銷度</option>
                      <option value="2">依字母順序Ａ到Ｚ</option>
                      <option value="3">依字母順序Ｚ到Ａ</option>
                      <option value="4">價格（從低到高）</option>
                      <option value="5">價格（從高到低）</option>
                      <option value="6">日期（從舊到新）</option>
                      <option value="7">日期（從新到舊）</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* 商品列表 */}
              <div className="row">
                {products.map((v, i) => {
                  const img = v.img.split(',');
                  return (
                    <div
                      className="col-6 col-md-3 d-flex justify-content-center p-md-3 p-2"
                      key={v.prod_id}
                    >
                      <div className="card border border-0 card-shadow position-relative">
                        <img
                          src={`${process.env.REACT_APP_IMAGE_URL}/images/products/${v.category_name}/${img[0]}`}
                          className="card-img-top bg-gray-200"
                          alt="..."
                        />
                        <div className="card-body text-left">
                          <div className="d-flex justify-content-between">
                            <h5 className="card-title text-info">
                              NT $ {v.price}
                            </h5>
                            <p>
                              <i className="fa-regular fa-heart text-info"></i>
                            </p>
                          </div>
                          <h6 className="card-title text-gray-300">{v.name}</h6>

                          {v.amount === 0 ? (
                            <p className="card-text text-danger">已售完</p>
                          ) : (
                            <p className="card-text text-primary-200">
                              僅剩 {v.amount} 件 !
                            </p>
                          )}
                          <button className="btn btn-primary-300 fs-sml w-100 d-block d-md-none">
                            加入購物車
                          </button>
                        </div>
                        <div className="card-body pt-0 card-btn card-shadow bg-white d-none d-md-block">
                          <button
                            className="btn btn-primary-300 fs-sml w-100"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            onClick={() => {
                              setCart(v);
                              // console.log(products);
                              // const item = { ...v, quantity: 1 };
                              // console.log(item);
                              // addItem({ ...item, id: item.prod_id });
                            }}
                          >
                            加入購物車
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {/* modal Filter 彈跳視窗 */}
        <div
          className="modal fade"
          id="exampleModalFilter"
          tabIndex="-1"
          aria-labelledby="exampleModalFilter"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-0">
              <div className="modal-header">
                <h1
                  className="modal-title fs-5 text-info"
                  id="exampleModalLabel"
                >
                  條件設定
                </h1>
                <button
                  type="button"
                  className="btn-close fs-sml"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="accordion accordion-flush">
                  {/* 供貨情況 */}
                  <div className="accordion-item border-bottom-1">
                    <h2
                      className="accordion-header border-0"
                      id="panelsStayOpen-headingOne"
                    >
                      <button
                        className="accordion-button bg-white ps-0 text-info-dark border-0"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapseOne"
                        aria-expanded="true"
                        aria-controls="panelsStayOpen-collapseOne"
                      >
                        供貨情況
                      </button>
                    </h2>
                    <div
                      id="panelsStayOpen-collapseOne"
                      className="accordion-collapse collapse show"
                      aria-labelledby="panelsStayOpen-headingOne"
                    >
                      <div className="accordion-body bg-white ps-0 bord">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label fs-sml text-info"
                            htmlFor="flexCheckDefault"
                          >
                            有庫存(180)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckChecked"
                          />
                          <label
                            className="form-check-label fs-sml text-info"
                            htmlFor="flexCheckChecked"
                          >
                            無庫存(3)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 價格 */}
                  <div className="accordion-item border-0">
                    <h2
                      className="accordion-header border-0"
                      id="panelsStayOpen-headingTwo"
                    >
                      <button
                        className="accordion-button collapsed bg-white ps-0 text-info-dark border-0"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapseTwo"
                        aria-expanded="false"
                        aria-controls="panelsStayOpen-collapseTwo"
                      >
                        價格
                      </button>
                    </h2>
                    <div
                      id="panelsStayOpen-collapseTwo"
                      className="accordion-collapse collapse"
                      aria-labelledby="panelsStayOpen-headingTwo"
                    >
                      <div className="accordion-body bg-white ps-0">
                        <div className="d-flex pb-2 align-items-center">
                          <h6 className="px-1 text-primary-200 mb-0 fs-sml">
                            $
                          </h6>
                          <input
                            type="number"
                            name="points"
                            min="0"
                            max="10"
                            value=""
                            placeholder="From"
                            className="w-100 fs-sml"
                          />
                        </div>
                        <div className="d-flex align-items-center">
                          <h6 className="px-1 text-primary-200 mb-0 fs-sml">
                            $
                          </h6>
                          <input
                            type="number"
                            name="points"
                            min="0"
                            max="10"
                            value=""
                            placeholder="To"
                            className="w-100 fs-sml"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 分類 */}
                  <div className="accordion-item border-0">
                    <h2
                      className="accordion-header border-0"
                      id="panelsStayOpen-headingThree"
                    >
                      <button
                        className="accordion-button collapsed bg-white ps-0 text-info-dark border-0"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapseThree"
                        aria-expanded="false"
                        aria-controls="panelsStayOpen-collapseThree"
                      >
                        分類
                      </button>
                    </h2>
                    <div
                      id="panelsStayOpen-collapseThree"
                      className="accordion-collapse collapse"
                      aria-labelledby="panelsStayOpen-headingThree"
                    >
                      <div className="accordion-body bg-white ps-0">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label text-info fs-sml"
                            htmlFor="flexCheckDefault"
                          >
                            沙發(10)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label text-info fs-sml"
                            htmlFor="flexCheckDefault"
                          >
                            椅子(3)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label text-info fs-sml"
                            htmlFor="flexCheckDefault"
                          >
                            桌子(15)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label text-info fs-sml"
                            htmlFor="flexCheckDefault"
                          >
                            櫥櫃(8)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label text-info fs-sml"
                            htmlFor="flexCheckDefault"
                          >
                            床 (11)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label text-info fs-sml"
                            htmlFor="flexCheckDefault"
                          >
                            燈(2)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label text-info fs-sml"
                            htmlFor="flexCheckDefault"
                          >
                            紡織(6)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label text-info fs-sml"
                            htmlFor="flexCheckDefault"
                          >
                            裝飾(12)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label text-info fs-sml"
                            htmlFor="flexCheckDefault"
                          >
                            廚具(20)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label text-info fs-sml"
                            htmlFor="flexCheckDefault"
                          >
                            浴室(18)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* modal Sort 彈跳視窗 */}
        <div
          className="modal fade"
          id="exampleModalSort"
          tabIndex="-1"
          aria-labelledby="exampleModalSort"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-0">
              <div className="modal-header">
                <h1
                  className="modal-title fs-5 text-info"
                  id="exampleModalLabel"
                >
                  排序依據
                </h1>
                <button
                  type="button"
                  className="btn-close fs-sml"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <button className="btn bg-white border-1 border-primary-300 text-primary-300 w-100 fs-sml my-1">
                  精選
                </button>
                <button className="btn bg-white border-1 border-primary-300 text-primary-300 w-100 fs-sml my-1">
                  暢銷度
                </button>
                <button className="btn bg-white border-1 border-primary-300 text-primary-300 w-100 fs-sml my-1">
                  依字母順序 A 到 Z
                </button>
                <button className="btn bg-white border-1 border-primary-300 text-primary-300 w-100 fs-sml my-1">
                  依字母順序 Z 到 A
                </button>
                <button className="btn bg-white border-1 border-primary-300 text-primary-300 w-100 fs-sml my-1">
                  價格 (從低到高)
                </button>
                <button className="btn bg-white border-1 border-primary-300 text-primary-300 w-100 fs-sml my-1">
                  價格 (從高到低)
                </button>
                <button className="btn bg-white border-1 border-primary-300 text-primary-300 w-100 fs-sml my-1">
                  日期 (從舊到新)
                </button>
                <button className="btn bg-white border-1 border-primary-300 text-primary-300 w-100 fs-sml my-1">
                  日期 (從新到舊)
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* modal Cart 彈跳視窗 */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-0 border-0">
              <div className="modal-header border-0">
                <h1
                  className="modal-title fs-5 text-gray-300"
                  id="staticBackdropLabel"
                >
                  {cart.name}
                </h1>
                <button
                  type="button"
                  className="btn-close fs-sml"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body border-0 pt-0">
                <h5 className="card-title text-info pb-3">NT $ {cart.price}</h5>
                {/* 選擇款式 */}
                {cart.amount > 0 ? (
                  <div className="form-floating">
                    <select
                      className="form-select text-gray-400"
                      id="floatingSelect"
                      value={shape}
                      onChange={(e) => {
                        setShape(e.target.value);
                      }}
                    >
                      <option className="text-gray-400" value="" disabled>
                        請選擇款式
                      </option>
                      <option value="藍色Blue" className="text-gray-400">
                        藍色 Blue
                      </option>
                      <option value="深灰色Gray" className="text-gray-400">
                        深灰色 Gray
                      </option>
                      <option value="綠色Green" className="text-gray-400">
                        綠色 Green
                      </option>
                      <option value="白色White" className="text-gray-400">
                        白色 White
                      </option>
                    </select>
                    <label htmlFor="floatingSelect" className="label-fs">
                      款式
                    </label>
                  </div>
                ) : (
                  /* 售完 */
                  <div className="text-info-dark">商品已售完</div>
                )}
                {/* 數量、加入購物車 */}
                {cart.amount > 0 && (
                  <div className="row pt-2">
                    <div className="col-5">
                      <div className="form-floating">
                        <select
                          className="form-select text-gray-400"
                          id="floatingSelect"
                          value={amount}
                          onChange={(e) => {
                            setAmount(e.target.value);
                          }}
                        >
                          <option value="" disabled>
                            請選擇數量
                          </option>
                          {Number(1, cart.amount >= 10 ? 9 : cart.amount).map(
                            (v2, i) => {
                              return (
                                <option
                                  key={v2}
                                  value={v2}
                                  className="text-gray-400"
                                >
                                  {v2}
                                </option>
                              );
                            }
                          )}
                          {cart.amount >= 10 && (
                            <option value="10" className="text-gray-400">
                              10 +
                            </option>
                          )}
                        </select>
                        <label htmlFor="floatingSelect" className="label-fs">
                          數量
                        </label>
                      </div>
                    </div>
                    <div className="col-7">
                      <button
                        className="btn btn-cart bg-gray border border-2 border-primary-200 text-primary-300 btn-cart w-100 h-100"
                        onClick={() => {
                          addToCart();
                        }}
                      >
                        加入購物車
                      </button>
                    </div>
                  </div>
                )}
                {/* 庫存狀態 */}
                <div className="py-2">
                  <p className="fs-6 text-gray-400 fs-sml mb-0">
                    庫存狀態 :
                    <span className="text-danger">
                      {' '}
                      {cart.amount === 0
                        ? '已售完'
                        : `僅剩 ${cart.amount} 件 !`}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Products;
