import clsx from "clsx";
import { ReactNode, forwardRef, HTMLAttributes } from "react";
import ModalVariants from "./ModalVariants";

export interface IModal extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    variant?: keyof typeof ModalVariants;
}

const Modal = forwardRef<HTMLDivElement, IModal>((props, ref) => {
    const { children, variant, className, ...rest } = props;

    const combinedClassName = clsx(
        className,
        ModalVariants[variant ?? "default"],
    );

    return (
        <div
            ref={ref}
            className={combinedClassName}
            {...rest}
        >
            {children}
        </div>
    );
});

Modal.displayName = "Modal";

export default Modal;
