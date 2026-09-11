package com.hirevibe.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuditChangeTrackingService {

    private final ObjectMapper objectMapper;

    public ChangeSnapshot createSnapshot(
            Object before,
            Object after
    ) {
        JsonNode beforeNode = sanitize(toJsonNode(before));
        JsonNode afterNode = sanitize(toJsonNode(after));

        Map<String, FieldChange> changes = new LinkedHashMap<>();

        collectChanges(
                "",
                beforeNode,
                afterNode,
                changes
        );

        return new ChangeSnapshot(
                writeJson(beforeNode),
                writeJson(afterNode),
                writeJson(changes)
        );
    }

    public String snapshotAfter(Object after) {
        return writeJson(
                sanitize(toJsonNode(after))
        );
    }

    public String snapshotBefore(Object before) {
        return writeJson(
                sanitize(toJsonNode(before))
        );
    }

    private JsonNode toJsonNode(Object value) {

        if (value == null) {
            return null;
        }

        try {
            return objectMapper.valueToTree(value);

        } catch (IllegalArgumentException exception) {

            throw new IllegalStateException(
                    "Unable to create audit snapshot",
                    exception
            );
        }
    }

    private JsonNode sanitize(JsonNode node) {

        if (node == null || node.isNull()) {
            return node;
        }

        if (node.isObject()) {

            ObjectNode objectNode = (ObjectNode) node;

            List<String> sensitiveFields = new ArrayList<>();

            Iterator<Map.Entry<String, JsonNode>> fields =
                    objectNode.fields();

            while (fields.hasNext()) {

                Map.Entry<String, JsonNode> entry =
                        fields.next();

                String field = entry.getKey();

                if (isSensitiveField(field)) {
                    sensitiveFields.add(field);
                    continue;
                }

                sanitize(entry.getValue());
            }

            objectNode.remove(sensitiveFields);

            return objectNode;
        }

        if (node.isArray()) {

            for (JsonNode child : node) {
                sanitize(child);
            }
        }

        return node;
    }

    private boolean isSensitiveField(String field) {

        String normalized = field
                .replace("_", "")
                .replace("-", "")
                .toLowerCase(Locale.ROOT);

        return normalized.equals("password")
                || normalized.equals("passwordhash")
                || normalized.equals("token")
                || normalized.equals("accesstoken")
                || normalized.equals("refreshtoken")
                || normalized.equals("tokenhash")
                || normalized.equals("jwt")
                || normalized.equals("authorization")
                || normalized.equals("cookie")
                || normalized.contains("secret")
                || normalized.contains("apikey")
                || normalized.contains("credentials")
                || normalized.contains("privatekey");
    }

    private void collectChanges(
            String path,
            JsonNode before,
            JsonNode after,
            Map<String, FieldChange> changes
    ) {

        if (before == null && after == null) {
            return;
        }

        if (before == null || after == null) {

            changes.put(
                    path,
                    new FieldChange(before, after)
            );

            return;
        }

        if (before.equals(after)) {
            return;
        }

        if (before.isObject() && after.isObject()) {

            Map<String, JsonNode> beforeFields =
                    new LinkedHashMap<>();

            before.fields().forEachRemaining(
                    entry ->
                            beforeFields.put(
                                    entry.getKey(),
                                    entry.getValue()
                            )
            );

            Map<String, JsonNode> afterFields =
                    new LinkedHashMap<>();

            after.fields().forEachRemaining(
                    entry ->
                            afterFields.put(
                                    entry.getKey(),
                                    entry.getValue()
                            )
            );

            beforeFields.forEach(
                    (field, beforeValue) -> {

                        String fieldPath =
                                path.isBlank()
                                        ? field
                                        : path + "." + field;

                        if (!afterFields.containsKey(field)) {

                            changes.put(
                                    fieldPath,
                                    new FieldChange(
                                            beforeValue,
                                            null
                                    )
                            );

                            return;
                        }

                        collectChanges(
                                fieldPath,
                                beforeValue,
                                afterFields.get(field),
                                changes
                        );
                    }
            );

            afterFields.forEach(
                    (field, afterValue) -> {

                        if (beforeFields.containsKey(field)) {
                            return;
                        }

                        String fieldPath =
                                path.isBlank()
                                        ? field
                                        : path + "." + field;

                        changes.put(
                                fieldPath,
                                new FieldChange(
                                        null,
                                        afterValue
                                )
                        );
                    }
            );

            return;
        }

        changes.put(
                path,
                new FieldChange(before, after)
        );
    }

    private String writeJson(Object value) {

        try {
            return objectMapper.writeValueAsString(value);

        } catch (JsonProcessingException exception) {

            throw new IllegalStateException(
                    "Unable to serialize audit change data",
                    exception
            );
        }
    }

    public record ChangeSnapshot(
            String beforeState,
            String afterState,
            String changedFields
    ) {
    }

    public record FieldChange(
            JsonNode before,
            JsonNode after
    ) {
    }
}