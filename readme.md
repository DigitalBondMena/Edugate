Main Navigation (Shared for EN and AR Home Pages)

Location:

ar/index

en/index

Structure:

Subcategories:
You’ll find the subcategory pages under the folder named sub-categories.

Related Blog:
Blogs related to each subcategory are located in the related-blog section.

-- exampel pagination will be use with this ui style

<?php
// Example values (these would come from your backend logic)
$total_pages = 6;
$current_page = 1; // Active page

echo '<div class="flex justify-center items-center gap-3 mt-6">';

for ($i = 1; $i <= $total_pages; $i++) {
    if ($i === $current_page) {
        // Active dot
        echo '<span class="w-3 h-3 rounded-full border border-red-500 bg-white"></span>';
    } else {
        // Inactive dot
        echo '<span class="w-3 h-3 rounded-full bg-red-500"></span>';
    }
}

echo '</div>';
?>
