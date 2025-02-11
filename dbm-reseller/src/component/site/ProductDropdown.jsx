import { useEffect, useMemo, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Space, Select, Image } from "antd";
import { getAllProducts } from "../../redux/action";
import { useTranslation } from "react-i18next";
import { getMediaPath } from "../../lib";

const ProductDropdown = ({ onProductChange, setSelectedProduct, selectedProduct }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const products = useSelector((state) => state?.app?.products);

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);

  const enabledProducts = useMemo(
    () => products?.filter((product) => product?.enable) || [],
    [products]
  );

  const handleProductChange = (value) => {
    const selectedProducts = enabledProducts?.find((p) => p?.id === value);
    if (selectedProduct && onProductChange) {
      setSelectedProduct(value);
      onProductChange(selectedProducts);
    }
  };

  return (
    <Select
      placeholder={t("selectaproduct")}
      style={{ width: "100%" }}
      value={selectedProduct?._id}
      onChange={handleProductChange}
      // size="large"
    >
      {enabledProducts?.map((product) => (
        <Select.Option key={product?._id} value={product?._id}>
          <Space>
            <Image
              preview={false}
              src={getMediaPath(product?.image)}
              alt="product_image"
              style={{ width: 40 }}
              loading="lazy"
            />
            {product?.name}
          </Space>
        </Select.Option>
      ))}
    </Select>
  );
};

export default ProductDropdown;
