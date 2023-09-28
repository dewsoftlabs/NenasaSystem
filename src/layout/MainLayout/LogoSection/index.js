import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonBase, CircularProgress } from '@mui/material'; // Import CircularProgress
import config from 'config';
import { MENU_OPEN } from 'store/customization/actions';

const LogoSection = () => {
  const shopName = useSelector((state) => state.shop.shopname);
  const defaultId = useSelector((state) => state.customization.defaultId);
  const image = useSelector((state) => state.shop.logo);

  const [cachedImage, setCachedImage] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const imagesrc = image ? process.env.REACT_APP_API_ENDPOINT + '/shop/getlogo/' + image : shopName;
    const cachedImage = new Image();
    cachedImage.src = imagesrc;

    cachedImage.onload = () => {
      setCachedImage(imagesrc);
      setLoading(false); // Image is loaded, set loading to false
    };
  }, [image, shopName]);

  const dispatch = useDispatch();

  return (
    <ButtonBase disableRipple onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })} component={Link} to={config.defaultPath}>
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          overflow: 'hidden',
          marginRight: '12px',
        }}
      >
        {loading ? ( // Conditionally render loading indicator
          <CircularProgress size={32} /> // Adjust size as needed
        ) : (
          <img
            src={cachedImage || shopName}
            alt={shopName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
      </div>
      <h2>{shopName}</h2>
    </ButtonBase>
  );
};

export default LogoSection;
