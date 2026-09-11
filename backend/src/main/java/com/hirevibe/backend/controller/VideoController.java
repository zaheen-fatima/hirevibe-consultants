package com.hirevibe.backend.controller;

import com.hirevibe.backend.dto.video.CreateVideoRequest;
import com.hirevibe.backend.dto.video.UpdateVideoRequest;
import com.hirevibe.backend.dto.video.VideoResponse;
import com.hirevibe.backend.service.VideoService;
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
@RequestMapping("/api/v1/videos")
@RequiredArgsConstructor
@Tag(
        name = "Videos",
        description = "Video content management, publishing and public video APIs"
)
public class VideoController {

    private final VideoService videoService;

    @Operation(
            summary = "Create video",
            description = "Creates a new video."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Video created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid video data"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<VideoResponse> createVideo(
            @Valid
            @RequestBody
            CreateVideoRequest request
    ) {
        return ResponseEntity.ok(
                videoService.createVideo(request)
        );
    }

    @Operation(
            summary = "Get public videos",
            description = "Returns published videos available to the public."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Videos retrieved successfully")
    })
    @GetMapping("/public")
    public ResponseEntity<Page<VideoResponse>> getPublicVideos(
            @RequestParam(required = false)
            String category,
            @PageableDefault(
                    size = 10,
                    sort = "publishedAt"
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                videoService.getPublicVideos(
                        category,
                        pageable
                )
        );
    }

    @Operation(
            summary = "Get public video by slug",
            description = "Retrieves a published video using its slug."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Video retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Video not found")
    })
    @GetMapping("/public/{slug}")
    public ResponseEntity<VideoResponse> getPublicVideoBySlug(
            @PathVariable String slug
    ) {
        return ResponseEntity.ok(
                videoService.getPublicVideoBySlug(slug)
        );
    }

    @Operation(
            summary = "Get videos",
            description = "Returns a paginated list of videos for administrative management."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Videos retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<Page<VideoResponse>> getVideos(
            @RequestParam(required = false)
            String title,
            @RequestParam(required = false)
            String category,
            @RequestParam(required = false)
            Boolean published,
            @RequestParam(required = false)
            Boolean featured,
            @PageableDefault(
                    size = 10,
                    sort = "createdAt"
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                videoService.getVideos(
                        title,
                        category,
                        published,
                        featured,
                        pageable
                )
        );
    }

    @Operation(
            summary = "Get video by ID",
            description = "Retrieves a video using its unique identifier."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Video retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Video not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<VideoResponse> getVideo(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                videoService.getVideo(id)
        );
    }

    @Operation(
            summary = "Update video",
            description = "Updates an existing video."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Video updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid video data"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Video not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<VideoResponse> updateVideo(
            @PathVariable Long id,
            @Valid
            @RequestBody
            UpdateVideoRequest request
    ) {
        return ResponseEntity.ok(
                videoService.updateVideo(
                        id,
                        request
                )
        );
    }

    @Operation(
            summary = "Publish video",
            description = "Publishes a video and makes it available publicly."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Video published successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Video not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/publish")
    public ResponseEntity<VideoResponse> publishVideo(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                videoService.publishVideo(id)
        );
    }

    @Operation(
            summary = "Unpublish video",
            description = "Removes a video from public publication."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Video unpublished successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Video not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/unpublish")
    public ResponseEntity<VideoResponse> unpublishVideo(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                videoService.unpublishVideo(id)
        );
    }

    @Operation(
            summary = "Feature video",
            description = "Marks a video as featured."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Video featured successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Video not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/feature")
    public ResponseEntity<VideoResponse> featureVideo(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                videoService.featureVideo(id)
        );
    }

    @Operation(
            summary = "Unfeature video",
            description = "Removes the featured status from a video."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Video unfeatured successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Video not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/unfeature")
    public ResponseEntity<VideoResponse> unfeatureVideo(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                videoService.unfeatureVideo(id)
        );
    }

    @Operation(
            summary = "Delete video",
            description = "Deletes an existing video."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Video deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Video not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(
            @PathVariable Long id
    ) {
        videoService.deleteVideo(id);

        return ResponseEntity.noContent().build();
    }
}