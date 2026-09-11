package com.hirevibe.backend.util;

import java.text.Normalizer;
import java.util.Locale;

public final class SlugUtil {

    private SlugUtil() {
    }

    public static String generateSlug(
            String value
    ) {

        String normalized =
                Normalizer.normalize(
                        value,
                        Normalizer.Form.NFD
                );

        return normalized
                .replaceAll(
                        "\\p{InCombiningDiacriticalMarks}+",
                        ""
                )
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
    }
}