"use client";
import CameraPane from "@/components/CameraPane";
import Tab from "@/components/Tab";
import { useState } from "react";

/**
 * TODO: 
 * Allow user to search and select camera based on id / address
 * show single camera
 * Allow user to select a point from map with a radius
 * Then show the camera that is within the radius
 * show as list, can try to assign the camera to a group
 */

const items = [
    {
        key: "camera",
        label: "Camera",
        children: <CameraPane />
    },
    {
        key: "map",
        label: "Map",
        children: <div className="text-blue-600">Coming soon</div>
    }
]

export default function LivePage() {
    const [currentTab, setCurrentTab] = useState("camera")

    return <div className="w-full flex items-center justify-center">
        <Tab
            className="w-full flex items-center justify-center"
            items={items}
            onChange={(value: string) => setCurrentTab(value)}
        />
    </div>;
}