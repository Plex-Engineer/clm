// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.10;

import "../CErc20.sol";
import "../CToken.sol";
import "../PriceOracle.sol";

interface ComptrollerLensInterface {
    function markets(address) external view returns (bool, uint256);

    function oracle() external view returns (PriceOracle);

    function getAccountLiquidity(
        address
    ) external view returns (uint256, uint256, uint256);

    function getAssetsIn(address) external view returns (CToken[] memory);

    function claimComp(address) external;

    function compAccrued(address) external view returns (uint256);

    function compSpeeds(address) external view returns (uint256);

    function compSupplySpeeds(address) external view returns (uint256);

    function compBorrowSpeeds(address) external view returns (uint256);

    function compSupplyState(address) external view returns (uint224, uint32);

    function borrowCaps(address) external view returns (uint256);

    function compSupplierIndex(
        address,
        address
    ) external view returns (uint256);

    function checkMembership(
        address account,
        CToken cToken
    ) external view returns (bool);
}

contract CantoLens {
    struct CTokenMetadata {
        address cToken;
        uint256 exchangeRateCurrent;
        uint256 supplyRatePerBlock;
        uint256 borrowRatePerBlock;
        uint256 reserveFactorMantissa;
        uint256 totalBorrows;
        uint256 totalReserves;
        uint256 totalSupply;
        uint256 totalCash;
        bool isListed;
        uint256 collateralFactorMantissa;
        address underlyingAssetAddress;
        uint256 cTokenDecimals;
        uint256 underlyingDecimals;
        uint256 compSupplySpeed;
        uint256 compBorrowSpeed;
        uint256 borrowCap;
    }

    function getCompSpeeds(
        ComptrollerLensInterface comptroller,
        CToken cToken
    ) internal returns (uint256, uint256) {
        // Getting comp speeds is gnarly due to not every network having the
        // split comp speeds from Proposal 62 and other networks don't even
        // have comp speeds.
        uint256 compSupplySpeed = 0;
        (
            bool compSupplySpeedSuccess,
            bytes memory compSupplySpeedReturnData
        ) = address(comptroller).call(
                abi.encodePacked(
                    comptroller.compSupplySpeeds.selector,
                    abi.encode(address(cToken))
                )
            );
        if (compSupplySpeedSuccess) {
            compSupplySpeed = abi.decode(compSupplySpeedReturnData, (uint256));
        }

        uint256 compBorrowSpeed = 0;
        (
            bool compBorrowSpeedSuccess,
            bytes memory compBorrowSpeedReturnData
        ) = address(comptroller).call(
                abi.encodePacked(
                    comptroller.compBorrowSpeeds.selector,
                    abi.encode(address(cToken))
                )
            );
        if (compBorrowSpeedSuccess) {
            compBorrowSpeed = abi.decode(compBorrowSpeedReturnData, (uint));
        }

        // If the split comp speeds call doesn't work, try the  oldest non-spit version.
        if (!compSupplySpeedSuccess || !compBorrowSpeedSuccess) {
            (bool compSpeedSuccess, bytes memory compSpeedReturnData) = address(
                comptroller
            ).call(
                    abi.encodePacked(
                        comptroller.compSpeeds.selector,
                        abi.encode(address(cToken))
                    )
                );
            if (compSpeedSuccess) {
                compSupplySpeed = (compBorrowSpeed = abi.decode(
                    compSpeedReturnData,
                    (uint)
                ));
            }
        }
        return (compSupplySpeed, compBorrowSpeed);
    }

    function cTokenMetadata(
        CToken cToken
    ) public returns (CTokenMetadata memory) {
        uint256 exchangeRateCurrent = cToken.exchangeRateCurrent();
        ComptrollerLensInterface comptroller = ComptrollerLensInterface(
            address(cToken.comptroller())
        );
        (bool isListed, uint256 collateralFactorMantissa) = comptroller.markets(
            address(cToken)
        );
        address underlyingAssetAddress;
        uint256 underlyingDecimals;

        if (compareStrings(cToken.symbol(), "cCANTO")) {
            underlyingAssetAddress = address(0);
            underlyingDecimals = 18;
        } else {
            CErc20 cErc20 = CErc20(address(cToken));
            underlyingAssetAddress = cErc20.underlying();
            underlyingDecimals = EIP20Interface(cErc20.underlying()).decimals();
        }

        (uint256 compSupplySpeed, uint256 compBorrowSpeed) = getCompSpeeds(
            comptroller,
            cToken
        );

        uint256 borrowCap = 0;
        (bool borrowCapSuccess, bytes memory borrowCapReturnData) = address(
            comptroller
        ).call(
                abi.encodePacked(
                    comptroller.borrowCaps.selector,
                    abi.encode(address(cToken))
                )
            );
        if (borrowCapSuccess) {
            borrowCap = abi.decode(borrowCapReturnData, (uint256));
        }

        return
            CTokenMetadata({
                cToken: address(cToken),
                exchangeRateCurrent: exchangeRateCurrent,
                supplyRatePerBlock: cToken.supplyRatePerBlock(),
                borrowRatePerBlock: cToken.borrowRatePerBlock(),
                reserveFactorMantissa: cToken.reserveFactorMantissa(),
                totalBorrows: cToken.totalBorrows(),
                totalReserves: cToken.totalReserves(),
                totalSupply: cToken.totalSupply(),
                totalCash: cToken.getCash(),
                isListed: isListed,
                collateralFactorMantissa: collateralFactorMantissa,
                underlyingAssetAddress: underlyingAssetAddress,
                cTokenDecimals: cToken.decimals(),
                underlyingDecimals: underlyingDecimals,
                compSupplySpeed: compSupplySpeed,
                compBorrowSpeed: compBorrowSpeed,
                borrowCap: borrowCap
            });
    }

    function cTokenMetadataAll(
        CToken[] calldata cTokens
    ) external returns (CTokenMetadata[] memory) {
        uint256 cTokenCount = cTokens.length;
        CTokenMetadata[] memory res = new CTokenMetadata[](cTokenCount);
        for (uint256 i = 0; i < cTokenCount; i++) {
            res[i] = cTokenMetadata(cTokens[i]);
        }
        return res;
    }

    struct CTokenBalances {
        address cTokenAddress;
        uint balanceOfCToken;
        uint256 balanceOfUnderlying;
        uint256 borrowBalance;
        uint256 rewards;
        bool isCollateral;
        uint256 supplyBalanceInUnderlying;
        uint256 underlyingAllowance;
    }

    function cTokenBalances(
        ComptrollerLensInterface comptroller,
        CToken cToken,
        address payable account
    ) public returns (CTokenBalances memory) {
        uint256 balanceOfCToken = cToken.balanceOf(account);
        uint256 borrowBalance = cToken.borrowBalanceCurrent(account);
        bool isCollateral = comptroller.checkMembership(account, cToken);
        uint256 supplyBalanceInUnderlying = cToken.balanceOfUnderlying(account);

        // get rewards data
        (uint224 compSupplyIndex, ) = comptroller.compSupplyState(
            address(cToken)
        );
        uint256 rewards = (sub(
            compSupplyIndex,
            comptroller.compSupplierIndex(address(cToken), account),
            "comp"
        ) * balanceOfCToken) / 1e36;

        // get the underlying data
        uint256 balanceOfUnderlying;
        uint256 underlyingAllowance;

        if (compareStrings(cToken.symbol(), "cCANTO")) {
            balanceOfUnderlying = account.balance;
            underlyingAllowance = account.balance;
        } else {
            CErc20 cErc20 = CErc20(address(cToken));
            EIP20Interface underlying = EIP20Interface(cErc20.underlying());
            balanceOfUnderlying = underlying.balanceOf(account);
            underlyingAllowance = underlying.allowance(
                account,
                address(cToken)
            );
        }

        return
            CTokenBalances({
                cTokenAddress: address(cToken),
                balanceOfCToken: balanceOfCToken,
                balanceOfUnderlying: balanceOfUnderlying,
                borrowBalance: borrowBalance,
                rewards: rewards,
                isCollateral: isCollateral,
                supplyBalanceInUnderlying: supplyBalanceInUnderlying,
                underlyingAllowance: underlyingAllowance
            });
    }

    function cTokenBalancesAll(
        ComptrollerLensInterface comptroller,
        CToken[] calldata cTokens,
        address payable account
    ) external returns (CTokenBalances[] memory) {
        uint256 cTokenCount = cTokens.length;
        CTokenBalances[] memory res = new CTokenBalances[](cTokenCount);
        for (uint256 i = 0; i < cTokenCount; i++) {
            res[i] = cTokenBalances(comptroller, cTokens[i], account);
        }
        return res;
    }

    struct CTokenUnderlyingPrice {
        address cToken;
        uint256 underlyingPrice;
    }

    function cTokenUnderlyingPrice(
        CToken cToken
    ) public returns (CTokenUnderlyingPrice memory) {
        ComptrollerLensInterface comptroller = ComptrollerLensInterface(
            address(cToken.comptroller())
        );
        PriceOracle priceOracle = comptroller.oracle();

        return
            CTokenUnderlyingPrice({
                cToken: address(cToken),
                underlyingPrice: priceOracle.getUnderlyingPrice(cToken)
            });
    }

    function cTokenUnderlyingPriceAll(
        CToken[] calldata cTokens
    ) external returns (CTokenUnderlyingPrice[] memory) {
        uint256 cTokenCount = cTokens.length;
        CTokenUnderlyingPrice[] memory res = new CTokenUnderlyingPrice[](
            cTokenCount
        );
        for (uint256 i = 0; i < cTokenCount; i++) {
            res[i] = cTokenUnderlyingPrice(cTokens[i]);
        }
        return res;
    }

    struct AccountLimits {
        CToken[] markets;
        uint256 liquidity;
        uint256 shortfall;
    }

    function getAccountLimits(
        ComptrollerLensInterface comptroller,
        address account
    ) public view returns (AccountLimits memory) {
        (uint256 errorCode, uint256 liquidity, uint256 shortfall) = comptroller
            .getAccountLiquidity(account);
        require(errorCode == 0);

        return
            AccountLimits({
                markets: comptroller.getAssetsIn(account),
                liquidity: liquidity,
                shortfall: shortfall
            });
    }

    function compareStrings(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function add(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, errorMessage);
        return c;
    }

    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;
        return c;
    }
}
