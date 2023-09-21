import { IImageData } from "@/data/types";

// We have already had an array => it could be somewhat easier to implement the shuffling
export const shuffleImage = (data: Partial<Pick<IImageData, "fileId" | "fileName" | "url">>[]) => {
    const imageCount = data.length;
    const clonedData = [...data];
    // Fisher-Yates shuffle
    // Implementation detail: https://www.geeksforgeeks.org/shuffle-a-given-array-using-fisher-yates-shuffle-algorithm/

    for (let i = imageCount - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [clonedData[i], clonedData[j]] = [clonedData[j], clonedData[i]];
    }

    return clonedData;
}