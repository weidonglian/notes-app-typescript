// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/react/dont-cleanup-after-each'