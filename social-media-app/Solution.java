class Solution {
    public boolean jump(int[] nums) {
        int max = 0;
        for(int i = 0; i < nums.length; i++){
            if( i > max) return false;
            max = Math.max(max, i + nums[i]);
            if(i + nums[i] >= nums.length - 1){
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        Solution s = new Solution();
        int[] nums = {2, 0, 3, 0, 1, 0, 5};
        System.out.println(s.jump(nums)); // Output: 2
    }
}
