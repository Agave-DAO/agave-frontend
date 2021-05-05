import { useWithdrawMutation } from '../../mutations/withdraw';
import { DepositWithdrawConfirm } from '../DepositWithdraw/DepositWithdrawConfirm';
import { DepositWithdrawAction } from '../DepositWithdraw/DepositWithdrawAction';
import { SubmissionStep, SuccessStep } from "../DepositWithdraw/ConfirmationSteps";


export const WithdrawConfirm: React.FC<{}> = ({ }) => DepositWithdrawConfirm({
    workflowSteps: [SubmissionStep, SuccessStep],
    action: DepositWithdrawAction.Withdraw,
    useActionMutation: useWithdrawMutation
});

