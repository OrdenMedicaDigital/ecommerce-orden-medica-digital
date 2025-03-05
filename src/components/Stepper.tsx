import { Step, Stepper } from "react-form-stepper";

export default function CustomStepper({step,steps}:{step:number,steps:string[]}){
    return (
        <Stepper activeStep={step} connectorStyleConfig={{ activeColor: '#3f51b5', completedColor: '#3f51b5', disabledColor: '#3f51b5', size: 2, style: "solid" }} styleConfig={{
            activeBgColor: '#3f51b5',
            completedBgColor: '#3f51b5',
            labelFontSize: '1rem',
            activeTextColor: '#fff',
            completedTextColor: '#fff',
            circleFontSize: '1rem',
            size: 24,
            circleFontColor: '#fff',
            labelColor: '#000',
            labelFontWeight: 'normal',
            completedLabelColor: '#fff',
            activeLabelColor: '#fff',
            lineMarginOffset: '0.5rem',
            borderRadius: '50%',
            fontWeight: 'normal',
            activeStepIconBorderColor: '#3f51b5',
            completedStepIconBorderColor: '#3f51b5',
            inactiveBgColor: '#fff',
            inactiveTextColor: '#000',
        }}>
        {steps.map((label, index) => (
          <Step key={index} label={label} />
        ))}
      </Stepper>
    )
}