#include <iostream>
#include <string>

#include <chrono>
#include <thread>
#include <vector>
#include <mutex>
#include <atomic>

using namespace std;

// ----------------------------------------------------------

int main()
{

  int tbl[16]    = {0,1,2,3,4,5,6,7,8,14,20,1,1,5,14,15};
  int result = 0;

  std::mutex m;
  atomic<int> next(0);
  
  auto func = [&tbl, &result, &m](int begin, int end) {
    int res = 0;
    for (int i = begin; i < end; ++i) {
      res += tbl[i];
    }
    
    std::lock_guard<std::mutex> lock_m(m);
    result += res; 
  };

  for (uint i = 0; i < 16; ++i) {
    result += tbl[i];
  }

  cerr << "Result no thread: "<<result << endl;

  result = 0;
  vector<thread> ths;
  ths.push_back(thread(func, 0, 8));
  ths.push_back(thread(func, 8, 16));
 
  for (auto& th : ths) {
    th.join();
  }

  cerr <<"Result thread: "<< result << endl;

  // 1 1 2 6 24 120 720 5040 40320 1278945280 -2102132736 1 1 120 1278945280 2004310016

  // Ex1: create two threads, use both to compute factorial(tbl[]) => result[]
  // result[i] = factorial(tbl[i])
  
  return 0;
}

// ----------------------------------------------------------
