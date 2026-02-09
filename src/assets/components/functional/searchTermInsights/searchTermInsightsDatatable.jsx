import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import MuiDataTableComponent from "../../common/muidatatableComponent";
import ExcelDownloadButton from "../../molecules/excelDownloadButton";
import overviewContext from "../../../../store/overview/overviewContext";
import { useSearchParams } from "react-router";
import ColumnPercentageDataComponent from '../../common/columnPercentageDataComponent';
import Typography from '@mui/material/Typography';
import NewPercentageDataComponent from "../../common/newPercentageDataComponent";






const SearchTermInsightsDatatable = () => {
    const { dateRange, formatDate } = useContext(overviewContext);
    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");

    const [keywordData, setKeywordData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const abortControllerRef = useRef(null);

    const fetchKeywordData = async () => {
        if (!operator) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsLoading(true);

        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error("Missing access token");
            setIsLoading(false);
            return;
        }

        const startDate = formatDate(dateRange[0].startDate);
        const endDate = formatDate(dateRange[0].endDate);

        try {
            const response = await fetch(
                `https://react-api-script.onrender.com/zydus/search-term-analytics?start_date=${startDate}&end_date=${endDate}&platform=${operator}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    signal: controller.signal,
                }
            );

            if (!response.ok) throw new Error("Failed to fetch keyword data");

            const result = await response.json();
            setKeywordData(result.data || []);
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Error fetching keyword data:", error);
                setKeywordData([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchKeywordData();
        }, 100);

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            clearTimeout(timeout);
        }
    }, [operator, dateRange]);

    const KeywordAnalysisColumnAmazon = [
        {
            field: "keyword",
            headerName: "SEARCH TERM",
            minWidth: 150,
            //pinned: 'left',
            renderCell: (params) => (

                <div className="text-icon-div">
                    <Typography variant="body2">{params.row.keyword}</Typography>
                </div>
            ),



        },
        {
            field: "campaigns_count_x", headerName: "# CAMPAIGNS", minWidth: 150,

        },
        {
            field: "IMPR_percent_share", headerName: "IMPR. % SHARE", minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.IMPR_percent_share}
                    percentValue={params.row.impressions_diff} // use this if diff exists
                />
            ),
            type: "number",
            align: "left",

            headerAlign: "left"


        },
        {
            field: "impressions_diff",
            headerName: "IMPR % CHANGE",
            minWidth: 100,

            hideable: false
        },
        {
            field: "organic_sov",
            headerName: "ORGANIC  SOV",
            minWidth: 150,
            align: "left",
            headerAlign: "left",
        },


        {
            field: "spend_x",
            headerName: "SPENDS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.spend_x} percentValue={params.row.spend_diff} />
            ),
            type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "spend_diff",
            headerName: "SPENDS % CHANGE",

            hideable: false
        }
        ,
        {
            field: "sales_x",
            headerName: "SALES",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.sales_x} percentValue={params.row.sales_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "sales_diff",
            headerName: "SALES % CHANGE",
            hideable: false
        }
        ,
        {
            field: "ctr_x",
            headerName: "CTR",
            minWidth: 150,
            renderCell: (params) => (
                <NewPercentageDataComponent firstValue={params.row.ctr_x} secValue={params.row.ctr_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "ctr_diff",
            headerName: "CTR % CHANGE",
            hideable: false
        }
        ,
        {
            field: "ad_type",
            headerName: "AD TYPE",
            minWidth: 150,
            renderCell: (params) => (
                <div className="text-icon-div">
                    <Typography variant="body2">{params.row.ad_type}</Typography>
                </div>
            ),
            align: "left",
            headerAlign: "left",
        },
        ,
        {
            field: "total_IMPR",
            headerName: "TOTAL IMPR.",
            minWidth: 150,
            type: "number", align: "left",
            headerAlign: "left",
        },
        ,
        {
            field: "rank_x",
            headerName: "ORGANIIC RANK",
            minWidth: 150,
            type: "number", align: "left",
            headerAlign: "left",
        },
        ,
        {
            field: "roas_x",
            headerName: "ROAS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.roas_x} percentValue={params.row.roas_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "roas_diff",
            headerName: "ROAS % CHANGE",
            hideable: false
        },
    ];

    const KeywordAnalysisColumnBlinkit = [
        {
            field: "keyword",
            headerName: "SEARCH TERM",
            minWidth: 150,
            renderCell: (params) => (
                <div className="text-icon-div">
                    <Typography variant="body2">{params.row.keyword}</Typography>
                </div>
            ),
        },
        {
            field: "campaign_count_current",
            headerName: "# CAMPAIGNS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.campaign_count_current}
                    percentValue={params.row.campaign_count_pct_change}
                />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "campaign_count_pct_change",
            headerName: "CAMPAIGNS % CHANGE",
            minWidth: 100,
            hideable: false
        },
        {
            field: "total_spend_current",
            headerName: "TOTAL SPEND",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.total_spend_current}
                    percentValue={params.row.total_spend_pct_change}
                />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        
        {
            field: "total_revenue_current",
            headerName: "TOTAL REVENUE",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.total_revenue_current}
                    percentValue={params.row.total_revenue_pct_change}
                />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
       
        {
            field: "roas_current",
            headerName: "ROAS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.roas_current}
                    percentValue={params.row.roas_pct_change}
                />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        
        {
            field: "impressions_current",
            headerName: "IMPRESSIONS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.impressions_current}
                    percentValue={params.row.impressions_pct_change}
                />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
       
       
        {
            field: "atc_current",
            headerName: "ADD TO CART",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.atc_current}
                    percentValue={params.row.atc_pct_change}
                />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
       
        {
            field: "units_sold_current",
            headerName: "UNITS SOLD",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.units_sold_current}
                    percentValue={params.row.units_sold_pct_change}
                />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
       
        {
            field: "new_users_current",
            headerName: "NEW USERS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.new_users_current}
                    percentValue={params.row.new_users_pct_change}
                />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
      
        {
            field: "cpc_current",
            headerName: "CPC",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.cpc_current}
                    percentValue={params.row.cpc_pct_change}
                />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
       
        {
            field: "cpa_current",
            headerName: "CPA",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.cpa_current}
                    percentValue={params.row.cpa_pct_change}
                />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
      
        {
            field: "overall_sos_current",
            headerName: "OVERALL SOS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.overall_sos_current}
                    percentValue={params.row.overall_sos_pct_change}
                />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
      
    ];

    const columns = useMemo(() => {
        if (operator === "Amazon") return KeywordAnalysisColumnAmazon;
        if (operator === "Blinkit") return KeywordAnalysisColumnBlinkit;
        return KeywordAnalysisColumnAmazon; // default to Amazon
    }, [operator]);

    return (
        <React.Fragment>
            <div className="py-2 border-bottom">
                <div className="row">
                    <div className="col-6">
                        <small className="d-inline-block py-1 px-2 bg-light rounded-pill">
                            report_date = Total 7 Days
                        </small>
                    </div>

                </div>
            </div>
            <div className="datatable-con-product-analytics">
                <MuiDataTableComponent
                    isLoading={isLoading}
                    isExport={true}
                    columns={columns}
                    data={keywordData}
                    getRowId={(row) => row.keyword}
                />
            </div>
        </React.Fragment>
    );
};

export default SearchTermInsightsDatatable;
