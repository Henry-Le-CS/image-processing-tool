import { ButtonHTMLAttributes, FC } from "react"

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: IButtonVariants;
}
const variants = {
    '1': 'bg-[#0064FF] hover:bg-[#0064FF]/50 text-white text-xs text-justify p-2 rounded-[22px]'
}

export type IButtonVariants =  keyof typeof variants

const Button: FC<IButton> = ({children, ...rest}) => {
    return (
        <button  {...rest}>
            {children}
        </button>
    )
}

export default Button