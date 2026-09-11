package com.hirevibe.backend.controller;

import com.hirevibe.backend.dto.article.ArticleResponse;
import com.hirevibe.backend.dto.article.CreateArticleRequest;
import com.hirevibe.backend.dto.article.UpdateArticleRequest;
import com.hirevibe.backend.service.ArticleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor
@Tag(
        name = "Articles",
        description = "Article creation, editing, publishing and public content APIs"
)
public class ArticleController {

    private final ArticleService articleService;

    @Operation(
            summary = "Create article",
            description = "Creates a new article."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Article created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid article data"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<ArticleResponse> createArticle(
            @Valid
            @RequestBody
            CreateArticleRequest request
    ) {
        return ResponseEntity.ok(
                articleService.createArticle(request)
        );
    }

    @Operation(
            summary = "Get public articles",
            description = "Returns published articles available to the public."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Articles retrieved successfully")
    })
    @GetMapping("/public")
    public ResponseEntity<Page<ArticleResponse>> getPublicArticles(
            @RequestParam(required = false)
            String category,
            @PageableDefault(
                    size = 10,
                    sort = "publishedAt"
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                articleService.getPublicArticles(
                        category,
                        pageable
                )
        );
    }

    @Operation(
            summary = "Get public article by slug",
            description = "Retrieves a published article using its slug."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Article retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Article not found")
    })
    @GetMapping("/public/{slug}")
    public ResponseEntity<ArticleResponse> getPublicArticleBySlug(
            @PathVariable String slug
    ) {
        return ResponseEntity.ok(
                articleService.getPublicArticleBySlug(slug)
        );
    }

    @Operation(
            summary = "Get articles",
            description = "Returns a paginated list of articles for administrative management."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Articles retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<Page<ArticleResponse>> getArticles(
            @RequestParam(required = false)
            String title,
            @RequestParam(required = false)
            String category,
            @RequestParam(required = false)
            Boolean published,
            @PageableDefault(
                    size = 10,
                    sort = "createdAt"
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                articleService.getArticles(
                        title,
                        category,
                        published,
                        pageable
                )
        );
    }

    @Operation(
            summary = "Get article by ID",
            description = "Retrieves an article using its unique identifier."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Article retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Article not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<ArticleResponse> getArticle(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                articleService.getArticle(id)
        );
    }

    @Operation(
            summary = "Update article",
            description = "Updates an existing article."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Article updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid article data"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Article not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<ArticleResponse> updateArticle(
            @PathVariable Long id,
            @Valid
            @RequestBody
            UpdateArticleRequest request
    ) {
        return ResponseEntity.ok(
                articleService.updateArticle(
                        id,
                        request
                )
        );
    }

    @Operation(
            summary = "Publish article",
            description = "Publishes an article and makes it available through public APIs."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Article published successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Article not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/publish")
    public ResponseEntity<ArticleResponse> publishArticle(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                articleService.publishArticle(id)
        );
    }

    @Operation(
            summary = "Unpublish article",
            description = "Removes an article from public publication."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Article unpublished successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Article not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/unpublish")
    public ResponseEntity<ArticleResponse> unpublishArticle(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                articleService.unpublishArticle(id)
        );
    }

    @Operation(
            summary = "Delete article",
            description = "Deletes an existing article."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Article deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Article not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(
            @PathVariable Long id
    ) {
        articleService.deleteArticle(id);

        return ResponseEntity.noContent().build();
    }
}