export const CAMERA_PANE_OPTIONS = [
    {
        label: "Camera Address",
        value: "address",
    },
    {
        label: "Camera Id",
        value: "id",
    },
]

export const IMAGE_ENDPOINT = "http://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=";
export const IMAGE_ENDPOINT_HEADERS = {
    "Host": "giaothong.hochiminhcity.gov.vn:8007",
    "Cookie": ".VDMS=6AD7641A2ABC108D3B84E857CF3E3FCE84B4D233F7F18BC4D82329E7090ADF6317611C833C59805D71F962D141613E8D5BA06C33B4D01B59317882C3428544A855D91D628B8DBF456404E731D861E030D49CE9F1A3ED6128EC976F83F9408C531E938AEA4662F0A37A30A193B59E5FD222714664"
}

export const IMAGE_AUTH_ENDPOINT = 'http://giaothong.hochiminhcity.gov.vn/'
export const IMAGE_AUTH_ENDPOINT_HEADERS = {
    Host: 'giaothong.hochiminhcity.gov.vn',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
}

export const LIVE_IMAGE_ENDPOINT = "http://giaothong.hochiminhcity.gov.vn/expandcameraplayer?camId="

export const CONDITION_STATUS_CLASSNAME = {
    'F': "text-[#FF0000]",
    'E': "text-[#FF4500]",
    'D': "text-[#FFA500]",
    'C': "text-[#FFA500]",
    'B': "text-[#329A40]",
    'A': "text-[#329A40]",
}

export const DENSITY_STATUS_CLASSNAME = {
    '4': "text-[#FF0000]",
    '3': "text-[#FF4500]",
    '2': "text-[#FFA500]",
    '1': "text-[#329A40]",
    '0': "text-[#329A40]",
}

export const CONDITION_MAPPING = {
    'A': 'Free flow',
    'B': 'Reasonable free flow',
    'C': 'Stable flow',
    'D': 'Approaching unstable flow',
    'E': 'Unstable flow',
    'F': 'Break down'
}

export const DENSITY_MAPPING = {
    '0': 'Sparse',
    '1': 'Low',
    '2': 'Moderate',
    '3': 'High',
    '4': 'Very High'
};
