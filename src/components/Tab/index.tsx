import { Tabs, TabsProps } from "antd"

const Tab = ({ items, onChange, ...props }: TabsProps) => {
    const defaultActiveKey = items?.[0]?.key || "1"

    return <Tabs
        defaultActiveKey={defaultActiveKey}
        items={items}
        onChange={onChange}
        {...props}
    />
}

export default Tab