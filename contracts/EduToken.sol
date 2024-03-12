// SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.0;
pragma solidity ^0.8.0;

// Add this line to suppress the warnings
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract EduToken is IERC20, Ownable {
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private _totalSupply;
    bool private _initialized;
    address private _initializer;

    modifier notInitialized() {
        require(!_initialized, "Contract is already initialized");
        _;
    }

    event Initialized(bool success, address indexed initializer);
    event NameAndSymbolSet(string name, string symbol, uint8 decimals);

    function initialize(
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    ) external notInitialized {
        _name = name_;
        _symbol = symbol_;
        _decimals = decimals_;
        _mint(msg.sender, 1000000 * (10**decimals_));
        transferOwnership(msg.sender);
        _initialized = true;
        _initializer = msg.sender;

        emit Initialized(true, msg.sender);
        emit NameAndSymbolSet(name_, symbol_, decimals_);
    }

    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: Cannot mint tokens to zero address");
        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: Transfer from the zero address");
        require(recipient != address(0), "ERC20: Transfer to the zero address");

        _balances[sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(sender, recipient, amount);
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: Approve from the zero address");
        require(spender != address(0), "ERC20: Approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);

        _approve(sender, msg.sender, _allowances[sender][msg.sender] - amount);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender] + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender] - subtractedValue);
        return true;
    }

    function isInitialized() public view returns (bool) {
        return _initialized;
    }

    function initializerAddress() public view returns (address) {
        return _initializer;
    }
}
