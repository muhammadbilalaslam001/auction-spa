import { useState } from "react";
import { useAuctions } from "@/hooks/useAuctions";
import { AuctionStatus } from "@/types";
import AuctionGrid from "@/components/auctions/auction-grid";
import AuctionFilters from "@/components/auctions/auction-filters";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 8;

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<AuctionStatus | "ALL">("ALL");

  const { auctions = [], isLoading } = useAuctions({
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
  });

  const handleFilterChange = (filter: AuctionStatus | "ALL") => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const totalCount=auctions?.length;

  // Calculate total pages based on total count of auctions
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Auctions Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Browse and bid on active auctions</p>
          </div>
          <div className="mt-4 md:mt-0">
            <AuctionFilters
              currentFilter={statusFilter}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

        <AuctionGrid auctions={auctions} isLoading={isLoading} />

        {/* Pagination */}
        {!isLoading && auctions?.length > 0 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={`cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(3, totalPages) }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              {totalPages > 3 && currentPage <= 3 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setCurrentPage(totalPages)}
                      className="cursor-pointer"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              
              {totalPages > 3 && currentPage > 3 && currentPage < totalPages - 2 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setCurrentPage(currentPage)}
                      isActive={true}
                      className="cursor-pointer"
                    >
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                </>
              )}
              
              {totalPages > 3 && currentPage >= totalPages - 2 && currentPage !== totalPages && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  {Array.from({ length: Math.min(3, totalPages) }).map((_, i) => {
                    const pageNumber = totalPages - 2 + i;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                          isActive={currentPage === pageNumber}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                </>
              )}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={`cursor-pointer ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default HomePage;
