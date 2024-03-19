const lightMode = {
  control: (existingStyles, state) => ({
    ...existingStyles,
    borderColor:'grey',
    '&:hover': {
      borderColor: 'black',
    },
  }),
  placeholder: (existingStyles)=> ({
    ...existingStyles,
    color: 'grey'
  })
};

const darkMode = {
  control: (existingStyles, state) => ({
    ...existingStyles,
    backgroundColor: '#18181b',
    color: state.isSelected ? 'white' : "yellow",
    borderColor:'grey',
    '&:hover': {
      borderColor: 'black',
    },
  }),
  singleValue: (existingStyles)=>({
     ...existingStyles,
     color: 'white',
  }),
  option: (existingStyles, state) => ({
    ...existingStyles,
    color:'white',
    backgroundColor: state.isSelected ? '#262626' : '#18181b',
    ':hover' : {
        backgroundColor: '#262626' ,
    }
  }),
  menu: (existingStyles)=> ({
    ...existingStyles,
    backgroundColor: '#18181b',
  }),
  placeholder: (existingStyles)=> ({
    ...existingStyles,
    color: 'grey'
  })
};

const customStyles={
  lightMode,
  darkMode,
}

export default customStyles;

