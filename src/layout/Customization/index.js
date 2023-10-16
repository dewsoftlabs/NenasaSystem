import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import {
  Drawer,
  Fab,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Slider,
  Switch,
  Tooltip,
  Typography
} from '@mui/material';
import { IconSettings } from '@tabler/icons';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { SET_BORDER_RADIUS, SET_FONT_FAMILY, TOGGLE_DARK_MODE } from 'store/customization/actions';
import { gridSpacing } from 'store/constant';

function valueText(value) {
  return `${value}px`;
}

const Customization = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);

  const [darkMode, setDarkMode] = useState(customization.darkMode);

  const toggleDarkMode = () => {
    dispatch({ type: TOGGLE_DARK_MODE });
    setDarkMode(!darkMode);
  };

  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const [borderRadius, setBorderRadius] = useState(customization.borderRadius);

  const handleBorderRadius = (event, newValue) => {
    setBorderRadius(newValue);
  };

  useEffect(() => {
    dispatch({ type: SET_BORDER_RADIUS, borderRadius });
  }, [dispatch, borderRadius]);

  const fontOptions = ['Roboto', 'Poppins', 'Inter'];

  const initialFont = fontOptions.find((font) => customization.fontFamily.includes(font)) || 'Roboto';

  const [fontFamily, setFontFamily] = useState(initialFont);

  useEffect(() => {
    const newFont = `'${fontFamily}', sans-serif`;
    dispatch({ type: SET_FONT_FAMILY, fontFamily: newFont });
  }, [dispatch, fontFamily]);

  useEffect(() => {
    if (darkMode) {
      // Apply your logic to activate dark theme here
      // This could include updating styles or dispatching actions
    }
  }, [darkMode]);

  return (
    <>
      <Tooltip title="Live Customize">
        <Fab
          component="div"
          onClick={handleToggle}
          size="medium"
          variant="circular"
          color="secondary"
          sx={{
            borderRadius: 0,
            borderTopLeftRadius: '50%',
            borderBottomLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomRightRadius: '4px',
            top: '25%',
            position: 'fixed',
            right: 10,
            zIndex: theme.zIndex.speedDial
          }}
        >
          <AnimateButton type="rotate">
            <IconButton color="inherit" size="large" disableRipple>
              <IconSettings />
            </IconButton>
          </AnimateButton>
        </Fab>
      </Tooltip>

      <Drawer
        anchor="right"
        onClose={handleToggle}
        open={open}
        PaperProps={{
          sx: {
            width: 280
          }
        }}
      >
        <PerfectScrollbar component="div">
          <Grid container spacing={gridSpacing} sx={{ p: 3 }}>
            <Grid item xs={12}>
              <SubCard title="Theme Mode">
                <FormControlLabel
                  control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
                  label={darkMode ? 'Dark Mode' : 'Light Mode'}
                  sx={{
                    '& .MuiSvgIcon-root': { fontSize: 28 },
                    '& .MuiFormControlLabel-label': { color: theme.palette.grey[900] }
                  }}
                />
              </SubCard>
            </Grid>
            <Grid item xs={12}>
              <SubCard title="Fonts">
                <FormControl>
                  <RadioGroup
                    aria-label="font-family"
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    name="row-radio-buttons-group"
                  >
                    {fontOptions.map((font) => (
                      <FormControlLabel
                        key={font}
                        value={font}
                        control={<Radio />}
                        label={font}
                        sx={{
                          '& .MuiSvgIcon-root': { fontSize: 28 },
                          '& .MuiFormControlLabel-label': { color: theme.palette.grey[900] }
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </SubCard>
            </Grid>
            <Grid item xs={12}>
              <SubCard title="Border Radius">
                <Grid item xs={12} container spacing={2} alignItems="center" sx={{ mt: 2.5 }}>
                  <Grid item>
                    <Typography variant="h6" color="secondary">
                      4px
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Slider
                      size="small"
                      value={borderRadius}
                      onChange={handleBorderRadius}
                      getAriaValueText={valueText}
                      valueLabelDisplay="on"
                      aria-labelledby="discrete-slider-small-steps"
                      marks
                      step={2}
                      min={4}
                      max={24}
                      color="secondary"
                      sx={{
                        '& .MuiSlider-valueLabel': {
                          color: 'secondary.light'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" color="secondary">
                      24px
                    </Typography>
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>
          </Grid>
        </PerfectScrollbar>
      </Drawer>
    </>
  );
};

export default Customization;
