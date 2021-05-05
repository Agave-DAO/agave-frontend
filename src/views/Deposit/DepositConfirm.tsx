import { useDepositMutation } from '../../mutations/deposit';
import { DepositWithdrawConfirm } from '../DepositWithdraw/DepositWithdrawConfirm';
import { ApprovalStep, SubmissionStep, SuccessStep } from "../DepositWithdraw/ConfirmationSteps";
import { DepositWithdrawAction } from '../DepositWithdraw/DepositWithdrawAction';

export const DepositConfirm: React.FC<{}> = ({ }) => DepositWithdrawConfirm({
    workflowSteps: [ApprovalStep, SubmissionStep, SuccessStep],
    action: DepositWithdrawAction.Deposit,
    useActionMutation: useDepositMutation
});

