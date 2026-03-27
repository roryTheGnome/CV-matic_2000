export type Position = {
    id: string;
    name: string;
};

export type GetPositionsResponse = {
    positions: {
        id: string;
        name: string;
    }[];
};