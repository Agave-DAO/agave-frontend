import React, { useState } from "react";
import { generatePath, useHistory, useRouteMatch } from "react-router-dom";
import { ConfirmationProgressHeader } from "../../components/Actions/ConfirmationProgressHeader";


export const MultiStep: React.FC<{ children: Array<any>, [x: string]: any }> = (props) => {
  const children = props.children.filter(c => c)
  const match = useRouteMatch<{ step: string }>()
  const { step: stepNumber } = match.params;
  const history = useHistory();

  const [step, setStep] = useState(Number(stepNumber || '0'));

  const next = (step === children.length - 1) ?
    undefined :
    () => {
      history.push({ pathname: generatePath(match.path, { ...match.params, ...{ step: step + 1 } }) });
      setStep(step + 1);
    }

  return (
    <div className="form-action-view">
      {/* Headers */}
      <div className="form-action-header">
        <ConfirmationProgressHeader 
          labels={children.map(child => child.props['header'] ?? child)}
          step={step + 1}
        />
      </div>

      {/* Step Details */}
      {React.cloneElement(children[step], { ...props, next })}
    </div>
  );
}
