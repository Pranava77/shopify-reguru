# Shopify ReGuru Theme Architecture

This document provides visual diagrams of the Shopify theme structure using Mermaid diagrams.

## Table of Contents
1. [Overall Architecture](#overall-architecture)
2. [Template Structure](#template-structure)
3. [Section Organization](#section-organization)
4. [Component Relationships](#component-relationships)
5. [File Structure](#file-structure)

---

## Overall Architecture

```mermaid
graph TB
    A[theme.liquid<br/>Main Layout] --> B[Header Group]
    A --> C[Main Content<br/>content_for_layout]
    A --> D[Footer Group]
    A --> E[Cart Drawer]
    
    B --> B1[Announcement Bar]
    B --> B2[Header]
    B --> B3[Mega Menu]
    
    C --> T1[Index Template]
    C --> T2[Product Template]
    C --> T3[Collection Template]
    C --> T4[Page Templates]
    C --> T5[Cart Template]
    C --> T6[Search Template]
    
    D --> D1[Footer]
    
    E --> E1[Cart Drawer Section]
    
    style A fill:#1e1a5c,color:#fff
    style B fill:#041c66,color:#fff
    style C fill:#28d98e,color:#000
    style D fill:#041c66,color:#fff
```

---

## Template Structure

```mermaid
graph LR
    subgraph "Templates"
        T1[index.json<br/>Homepage]
        T2[product.json<br/>Product Detail]
        T3[collection.json<br/>Collection Listing]
        T4[page.about.json<br/>About Page]
        T5[page.contact.json<br/>Contact Page]
        T6[page.franchise.json<br/>Franchise Page]
        T7[page.sale.json<br/>Sale Page]
        T8[page.product-category.json<br/>Product Category]
        T9[page.sub-category.json<br/>Sub Category]
        T10[cart.json<br/>Cart Page]
        T11[search.json<br/>Search Results]
    end
    
    subgraph "Common Sections"
        S1[announcement-bar]
        S2[header]
        S3[mega-menu]
        S4[footer]
    end
    
    T1 --> S1
    T1 --> S2
    T1 --> S3
    T1 --> S5[hero-banner]
    T1 --> S6[product-grid]
    T1 --> S7[feature-cards]
    T1 --> S8[testimonials]
    T1 --> S9[faq]
    T1 --> S4
    
    T2 --> S1
    T2 --> S2
    T2 --> S3
    T2 --> S10[product-detail]
    T2 --> S7
    T2 --> S4
    
    T3 --> S1
    T3 --> S2
    T3 --> S3
    T3 --> S11[filtered-product-grid]
    T3 --> S4
    
    T4 --> S1
    T4 --> S2
    T4 --> S3
    T4 --> S12[about-us]
    T4 --> S4
    
    T5 --> S1
    T5 --> S2
    T5 --> S3
    T5 --> S13[contact]
    T5 --> S4
    
    T6 --> S1
    T6 --> S2
    T6 --> S3
    T6 --> S14[franchise]
    T6 --> S4
    
    T7 --> S1
    T7 --> S2
    T7 --> S3
    T7 --> S15[sale]
    T7 --> S4
    
    T8 --> S1
    T8 --> S2
    T8 --> S3
    T8 --> S16[product-category]
    T8 --> S4
    
    T9 --> S1
    T9 --> S2
    T9 --> S3
    T9 --> S17[category-showcase]
    T9 --> S4
    
    T10 --> S1
    T10 --> S2
    T10 --> S3
    T10 --> S18[cart]
    T10 --> S4
    
    T11 --> S1
    T11 --> S2
    T11 --> S3
    T11 --> S19[search-results]
    T11 --> S4
    
    style T1 fill:#28d98e,color:#000
    style T2 fill:#28d98e,color:#000
    style T3 fill:#28d98e,color:#000
```

---

## Section Organization

```mermaid
graph TD
    subgraph "Navigation Sections"
        NAV1[announcement-bar.liquid]
        NAV2[header.liquid]
        NAV3[mega-menu.liquid]
        NAV4[category-nav.liquid]
    end
    
    subgraph "Content Sections"
        CONT1[hero-banner.liquid]
        CONT2[product-grid.liquid]
        CONT3[product-detail.liquid]
        CONT4[filtered-product-grid.liquid]
        CONT5[product-category.liquid]
        CONT6[category-showcase.liquid]
    end
    
    subgraph "Feature Sections"
        FEAT1[feature-cards.liquid]
        FEAT2[testimonials.liquid]
        FEAT3[faq.liquid]
        FEAT4[about-us.liquid]
        FEAT5[contact.liquid]
        FEAT6[franchise.liquid]
        FEAT7[sale.liquid]
    end
    
    subgraph "E-commerce Sections"
        EC1[cart.liquid]
        EC2[cart-drawer.liquid]
        EC3[search-results.liquid]
    end
    
    subgraph "Layout Sections"
        LAY1[header-group.liquid]
        LAY2[footer-group.liquid]
        LAY3[footer.liquid]
    end
    
    style NAV1 fill:#1e1a5c,color:#fff
    style NAV2 fill:#1e1a5c,color:#fff
    style NAV3 fill:#1e1a5c,color:#fff
    style CONT1 fill:#28d98e,color:#000
    style CONT2 fill:#28d98e,color:#000
    style CONT3 fill:#28d98e,color:#000
    style LAY1 fill:#041c66,color:#fff
    style LAY2 fill:#041c66,color:#fff
```

---

## Component Relationships

```mermaid
graph TB
    subgraph "Sections"
        S1[product-grid.liquid]
        S2[product-detail.liquid]
        S3[testimonials.liquid]
        S4[faq.liquid]
        S5[cart-drawer.liquid]
    end
    
    subgraph "Snippets"
        SN1[product-card.liquid]
        SN2[testimonial-card.liquid]
        SN3[faq-item.liquid]
        SN4[cart-drawer.liquid]
        SN5[icon-arrow.liquid]
    end
    
    S1 -->|renders| SN1
    S2 -->|renders| SN1
    S3 -->|renders| SN2
    S4 -->|renders| SN3
    S5 -->|renders| SN4
    S1 -->|uses| SN5
    S2 -->|uses| SN5
    
    style S1 fill:#28d98e,color:#000
    style S2 fill:#28d98e,color:#000
    style SN1 fill:#b1d8ff,color:#000
    style SN2 fill:#b1d8ff,color:#000
```

---

## File Structure

```mermaid
graph TD
    ROOT[shopify-reguru/] --> LAYOUT[layout/]
    ROOT --> TEMPLATES[templates/]
    ROOT --> SECTIONS[sections/]
    ROOT --> SNIPPETS[snippets/]
    ROOT --> ASSETS[assets/]
    ROOT --> CONFIG[config/]
    ROOT --> LOCALES[locales/]
    
    LAYOUT --> L1[theme.liquid]
    
    TEMPLATES --> T1[index.json]
    TEMPLATES --> T2[product.json]
    TEMPLATES --> T3[collection.json]
    TEMPLATES --> T4[page.*.json]
    TEMPLATES --> T5[cart.json]
    TEMPLATES --> T6[search.json]
    
    SECTIONS --> S1[announcement-bar.liquid]
    SECTIONS --> S2[header.liquid]
    SECTIONS --> S3[mega-menu.liquid]
    SECTIONS --> S4[hero-banner.liquid]
    SECTIONS --> S5[product-grid.liquid]
    SECTIONS --> S6[product-detail.liquid]
    SECTIONS --> S7[filtered-product-grid.liquid]
    SECTIONS --> S8[feature-cards.liquid]
    SECTIONS --> S9[testimonials.liquid]
    SECTIONS --> S10[faq.liquid]
    SECTIONS --> S11[about-us.liquid]
    SECTIONS --> S12[contact.liquid]
    SECTIONS --> S13[franchise.liquid]
    SECTIONS --> S14[sale.liquid]
    SECTIONS --> S15[footer.liquid]
    SECTIONS --> S16[cart.liquid]
    SECTIONS --> S17[search-results.liquid]
    SECTIONS --> S18[header-group.liquid]
    SECTIONS --> S19[footer-group.liquid]
    
    SNIPPETS --> SN1[product-card.liquid]
    SNIPPETS --> SN2[testimonial-card.liquid]
    SNIPPETS --> SN3[faq-item.liquid]
    SNIPPETS --> SN4[cart-drawer.liquid]
    SNIPPETS --> SN5[icon-arrow.liquid]
    
    ASSETS --> A1[theme.css]
    ASSETS --> A2[theme.js]
    ASSETS --> A3[*.png images]
    
    CONFIG --> C1[settings_data.json]
    CONFIG --> C2[settings_schema.json]
    
    LOCALES --> LOC1[en.default.json]
    
    style ROOT fill:#1e1a5c,color:#fff
    style LAYOUT fill:#041c66,color:#fff
    style TEMPLATES fill:#28d98e,color:#000
    style SECTIONS fill:#b1d8ff,color:#000
    style SNIPPETS fill:#b1d8ff,color:#000
```

---

## Page Flow Diagram

```mermaid
flowchart TD
    START[User Visits Site] --> THEME[theme.liquid]
    
    THEME --> HEADER[Header Group]
    HEADER --> ANNOUNCE[Announcement Bar]
    HEADER --> HEAD[Header with Logo/Search]
    HEADER --> MEGA[Mega Menu Navigation]
    
    THEME --> MAIN{Main Content}
    
    MAIN -->|Homepage| INDEX[Index Template]
    INDEX --> HERO[Hero Banner]
    INDEX --> PRODGRID[Product Grid]
    INDEX --> FEATURES[Feature Cards]
    INDEX --> TESTIMONIALS[Testimonials]
    INDEX --> FAQ[FAQ Section]
    
    MAIN -->|Product Page| PROD[Product Template]
    PROD --> PRODDETAIL[Product Detail Section]
    PROD --> FEATURES2[Feature Cards]
    
    MAIN -->|Collection| COLL[Collection Template]
    COLL --> FILTERED[Filtered Product Grid]
    
    MAIN -->|About| ABOUT[About Page]
    ABOUT --> ABOUTUS[About Us Section]
    
    MAIN -->|Contact| CONTACT[Contact Page]
    CONTACT --> CONTACTSEC[Contact Section]
    
    MAIN -->|Franchise| FRANCHISE[Franchise Page]
    FRANCHISE --> FRANCHISESEC[Franchise Section]
    
    MAIN -->|Sale| SALE[Sale Page]
    SALE --> SALESEC[Sale Section]
    
    MAIN -->|Cart| CART[Cart Template]
    CART --> CARTSEC[Cart Section]
    
    MAIN -->|Search| SEARCH[Search Template]
    SEARCH --> SEARCHSEC[Search Results]
    
    THEME --> FOOTER[Footer Group]
    FOOTER --> FOOT[Footer Section]
    
    THEME --> CARTDRAWER[Cart Drawer]
    
    style THEME fill:#1e1a5c,color:#fff
    style HEADER fill:#041c66,color:#fff
    style MAIN fill:#28d98e,color:#000
    style FOOTER fill:#041c66,color:#fff
```

---

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Theme as theme.liquid
    participant Template as Template JSON
    participant Section as Section Liquid
    participant Snippet as Snippet Liquid
    participant Shopify as Shopify Data
    
    User->>Theme: Request Page
    Theme->>Template: Load Template Config
    Template->>Section: Render Sections in Order
    Section->>Shopify: Fetch Product/Collection Data
    Shopify-->>Section: Return Data
    Section->>Snippet: Render Reusable Components
    Snippet-->>Section: Return HTML
    Section-->>Template: Return Section HTML
    Template-->>Theme: Return Content
    Theme-->>User: Render Complete Page
```

---

## Section Block Structure

```mermaid
graph LR
    subgraph "Sections with Blocks"
        S1[product-grid]
        S2[mega-menu]
        S3[feature-cards]
        S4[testimonials]
        S5[faq]
        S6[footer]
        S7[about-us]
        S8[filtered-product-grid]
    end
    
    S1 --> B1[category_tab blocks]
    S2 --> B2[menu_item blocks]
    S2 --> B3[simple_link blocks]
    S3 --> B4[card blocks]
    S4 --> B5[testimonial blocks]
    S5 --> B6[tab blocks]
    S5 --> B7[faq_item blocks]
    S6 --> B8[category_link blocks]
    S6 --> B9[support_link blocks]
    S7 --> B10[brand_logo blocks]
    S8 --> B11[filter_group blocks]
    
    style S1 fill:#28d98e,color:#000
    style S2 fill:#1e1a5c,color:#fff
    style S3 fill:#b1d8ff,color:#000
```

---

## Asset Dependencies

```mermaid
graph TD
    THEME[theme.liquid] --> CSS[theme.css]
    THEME --> JS[theme.js]
    THEME --> FONTS[Google Fonts]
    
    CSS --> IMG1[Background Images]
    CSS --> IMG2[Icon Images]
    
    SECTIONS[Sections] --> IMG3[Product Images]
    SECTIONS --> IMG4[Brand Logos]
    SECTIONS --> IMG5[Feature Icons]
    
    SNIPPETS[Snippets] --> IMG6[Card Images]
    
    style THEME fill:#1e1a5c,color:#fff
    style CSS fill:#28d98e,color:#000
    style JS fill:#28d98e,color:#000
```

---

## Notes

- **theme.liquid** is the root layout file that wraps all pages
- **Templates** (JSON files) define which sections appear on each page type
- **Sections** are reusable page components that can have blocks
- **Snippets** are smaller reusable components rendered within sections
- **Header Group** and **Footer Group** are special sections that wrap header/footer content
- All templates share common sections (announcement-bar, header, mega-menu, footer)
- The cart drawer is always available via theme.liquid, not template-specific
