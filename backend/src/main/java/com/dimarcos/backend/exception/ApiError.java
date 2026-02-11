package com.dimarcos.backend.exception;

import java.time.LocalDateTime;
import java.util.List;

public class ApiError {

    private int status;
    private String message;
    private LocalDateTime timestamp;
    private List<FieldError> errors;

    public ApiError(int status, String message, List<FieldError> errors) {
        this.status = status;
        this.message = message;
        this.errors = errors;
        this.timestamp = LocalDateTime.now();
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public List<FieldError> getErrors() {
        return errors;
    }

    public static class FieldError {
        private String field;
        private String error;

        public FieldError(String field, String error) {
            this.field = field;
            this.error = error;
        }

        public String getField() {
            return field;
        }

        public String getError() {
            return error;
        }
    }
}
