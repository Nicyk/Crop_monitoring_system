import api from "./baseApi";

// 定义分类数据类型
import { ExtendedTreeDataNode } from "@/types/category";

// 定义API响应类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// API请求类型
interface CategoryCreateRequest {
  title: string;
  parentKey: string | null;
  weight?: number;
}

interface CategoryUpdateRequest {
  title?: string;
  parentKey?: string | null;
  weight?: number;
}

// 前端与后端数据转换函数
// const mapToApiCategory = (
//   treeNode: Partial<ExtendedTreeDataNode>
// ): CategoryCreateRequest | CategoryUpdateRequest => {
//   return {
//     title: treeNode.title as string,
//     weight: treeNode.weight,
//     parentKey: treeNode.parentKey,
//   };
// };

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 获取所有分类
    // 获取分类树结构
    getCategoryTree: builder.query<ApiResponse<ExtendedTreeDataNode[]>, void>({
      query: () => "/category",
      providesTags: ["Category"],
      transformResponse: (response: ApiResponse<any[]>) => {
        // 类似的转换逻辑
        // 这里需要递归转换树结构
        if (response && response.data) {
          const transformTree = (nodes: any[]): ExtendedTreeDataNode[] => {
            return nodes.map((node) => ({
              key: node.key,
              title: node.title,
              weight: node.weight,
              parentKey: node.parentKey,
              children: node.children
                ? transformTree(node.children)
                : undefined,
            }));
          };

          return {
            ...response,
            data: transformTree(response.data),
          };
        }
        return response;
      },
    }),

    // 根据ID获取分类
    getCategoryById: builder.query<ApiResponse<ExtendedTreeDataNode>, string>({
      query: (key) => `/category/${key}`,
      providesTags: (result, error, key) => [{ type: "Category", key }],
      transformResponse: (response: ApiResponse<any>) => {
        if (response && response.data) {
          return {
            ...response,
            data: {
              key: response.data.key,
              title: response.data.title,
              weight: response.data.weight,
              parentKey: response.data.parentKey,
              // 不需要处理children，因为这是单个节点
            },
          };
        }
        return response;
      },
    }),

    // 创建分类
    createCategory: builder.mutation<
      ApiResponse<ExtendedTreeDataNode>,
      Omit<ExtendedTreeDataNode, "key">
    >({
      query: (category) => ({
        url: "/category",
        method: "POST",
        body: category,
      }),
      invalidatesTags: ["Category"],
      transformResponse: (response: ApiResponse<any>) => {
        if (response && response.data) {
          return {
            ...response,
            data: {
              key: response.data.key,
              title: response.data.title,
              weight: response.data.weight,
              parentKey: response.data.parentKey,
            },
          };
        }
        return response;
      },
    }),

    // 更新分类
    updateCategory: builder.mutation<
      ApiResponse<ExtendedTreeDataNode>,
      { key: string; data: Partial<ExtendedTreeDataNode> }
    >({
      query: ({ key, data }) => ({
        url: `/category/${key}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { key }) => [
        { type: "Category", key },
        "Category",
      ],
      transformResponse: (response: ApiResponse<any>) => {
        // 同上述转换逻辑
        if (response && response.data) {
          return {
            ...response,
            data: {
              key: response.data.key,
              title: response.data.title,
              weight: response.data.weight,
              parentKey: response.data.parentKey,
            },
          };
        }
        return response;
      },
    }),

    // 删除分类
    deleteCategory: builder.mutation<ApiResponse<void>, string>({
      query: (key) => ({
        url: `/category/${key}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    // 更新分类权重
    updateCategoryWeight: builder.mutation<
      ApiResponse<ExtendedTreeDataNode>,
      { key: string; weight: number }
    >({
      query: ({ key, weight }) => ({
        url: `/category/${key}/weight`,
        method: "PATCH",
        body: { weight },
      }),
      invalidatesTags: (result, error, { key }) => [
        { type: "Category", key },
        "Category",
      ],
      transformResponse: (response: ApiResponse<any>) => {
        // 同上述转换逻辑
        if (response && response.data) {
          return {
            ...response,
            data: {
              key: response.data.key,
              title: response.data.title,
              weight: response.data.weight,
              parentKey: response.data.parentKey,
            },
          };
        }
        return response;
      },
    }),

    // 批量更新分类顺序或权重
    batchUpdateCategories: builder.mutation<
      ApiResponse<ExtendedTreeDataNode[]>,
      { categories: Array<{ key: string; weight: number }> }
    >({
      query: (data) => ({
        url: "/category/batch",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Category"],
      transformResponse: (response: ApiResponse<any[]>) => {
        // 同上述转换逻辑，需要转换数组
        if (response && response.data) {
          return {
            ...response,
            data: response.data.map((item) => ({
              key: item.key,
              title: item.title,
              weight: item.weight,
              parentKey: item.parentKey,
            })),
          };
        }
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

// 导出所有API钩子
export const {
  useGetCategoryTreeQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryWeightMutation,
  useBatchUpdateCategoriesMutation,
} = categoryApi;
