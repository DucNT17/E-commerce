import React, { memo } from "react";
import usePagination from "hooks/usePagination";
import { useSearchParams } from "react-router-dom";
import PagiItem from "./PagiItem";

const Pagination = ({ totalCount }) => {
    const [params] = useSearchParams();
    const pagination = usePagination(totalCount, +params.get("page") || 1);

    const range = () => {
        const currentPage = +params.get("page");
        const pageSize = +process.env.REACT_APP_LIMIT || 10;
        const start = Math.min((currentPage - 1) * pageSize + 1, totalCount);
        const end = Math.min(currentPage * pageSize, totalCount);
        return `${start} - ${end}`;
    };
    return (
        <div className="flex w-full justify-between items-center mt-10">
            {!+params.get("page") ? (
                <span className="text-sm hidden lg:inline-block italic">{`Show ${Math.min(
                    totalCount,
                    1
                )} - ${Math.min(
                    +process.env.REACT_APP_LIMIT,
                    totalCount
                )} trên ${totalCount}`}</span>
            ) : (
                ""
            )}
            {+params.get("page") ? (
                <span className="text-sm hidden lg:inline-block italic">{`Show ${range()} from ${totalCount}`}</span>
            ) : (
                ""
            )}
            <div className="flex mt-8 lg:mt-0 items-center">
                {pagination?.map((el) => (
                    <PagiItem key={el}>{el}</PagiItem>
                ))}
            </div>
        </div>
    );
};

export default memo(Pagination);
