import api from "./baseApi";
import { DataType } from "../types/approval";

// 定义响应类型
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export const approvalApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 获取审批列表
    getApprovals: builder.query<ApiResponse<DataType[]>, void>({
      query: () => "/approval",
      providesTags: ["Approval"],
    }),

    // 获取单个审批详情
    getApprovalById: builder.query<ApiResponse<DataType>, string>({
      query: (id) => `/approval/${id}`,
      providesTags: (result, error, id) => [{ type: "Approval", id }],
    }),

    // 创建新审批
    createApproval: builder.mutation<
      ApiResponse<DataType>,
      Omit<DataType, "key" | "approveTime" | "approveStatus">
    >({
      query: (approval) => ({
        url: "/approval",
        method: "POST",
        body: approval,
      }),
      invalidatesTags: ["Approval"],
    }),

    // 更新审批
    updateApproval: builder.mutation<
      ApiResponse<DataType>,
      { id: string; data: Partial<DataType> }
    >({
      query: ({ id, data }) => ({
        url: `/approval/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Approval", id },
        "Approval",
      ],
    }),

    // 审批通过
    approveApplication: builder.mutation<ApiResponse<DataType>, string>({
      query: (id) => ({
        url: `/approval/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Approval", id },
        "Approval",
      ],
    }),

    // 审批驳回
    rejectApplication: builder.mutation<
      ApiResponse<DataType>,
      { id: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: `/approval/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Approval", id },
        "Approval",
      ],
    }),

    // 上传文件
    uploadFile: builder.mutation<ApiResponse<{ url: string }>, FormData>({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),
  }),
  overrideExisting: false,
});

// 导出生成的hooks
export const {
  useGetApprovalsQuery,
  useGetApprovalByIdQuery,
  useCreateApprovalMutation,
  useUpdateApprovalMutation,
  useApproveApplicationMutation,
  useRejectApplicationMutation,
  useUploadFileMutation,
} = approvalApi;
