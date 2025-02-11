import { createContext, useState } from 'react'

export const PinContext = createContext()

const PinProvider = ({ children }) => {
    const [currentStep, setCurrentStep] = useState("initial");

    return (
        <PinContext.Provider value={{ setCurrentStep, currentStep }}>
            {children}
        </PinContext.Provider>
    )
}

export default PinProvider;