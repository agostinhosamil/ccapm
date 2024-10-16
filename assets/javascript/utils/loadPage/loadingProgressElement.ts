import { styled } from '@styled'

export const loadingProgressElement = styled.div({
  width: '100%',
  height: '5px',
  position: 'fixed',
  top: '0px',
  left: '0px',
  right: '0px',
  zIndex: '10000',
  backgroundColor: '#ffffff',
  pointerEvents: 'none',

  '&:before': {
    content: '""',
    position: 'absolute',
    borderRadius: '10px',
    top: '0',
    right: '100%',
    bottom: '0',
    left: '0',
    background: '#bca4eb',
    width: '0',
    animation: 'borealisBar 1.3s linear infinite'
  },

  '@keyframes borealisBar': {
    '0%': {
      left: '0%',
      right: '100%',
      width: '0%',
    },

    '50%': {
      left: '0%',
      right: '75%',
      width: '58%',
    },

    '80%': {
      right: '0%',
      left: '85%',
      width: '15%',
    },

    '100%': {
      left: '100%',
      right: '0%',
      width: '0%',
    },
  }
})
