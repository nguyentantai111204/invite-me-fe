"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button, Typography, Paper } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { StackCenter, StackColAlignJustCenter } from "../stack-custom/stack-custom";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <StackCenter sx={{ width: "100%", height: "100%", minHeight: 300, p: 3 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 480,
              textAlign: "center",
              borderRadius: 2,
            }}
          >
            <StackColAlignJustCenter spacing={2}>
              <Typography variant="h6" color="error" sx={{ fontWeight: "bold" }}>
                Đã xảy ra lỗi khi kết xuất Canvas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {this.state.error?.message || "Không thể tải thành phần chỉnh sửa thiệp."}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
                sx={{ mt: 1 }}
              >
                Thử lại
              </Button>
            </StackColAlignJustCenter>
          </Paper>
        </StackCenter>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
